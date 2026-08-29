'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { FlashcardSet, Flashcard, FlashcardSession } from '@/types';

// Fetch all flashcard sets with the user's mastery count
export function useFlashcardSets() {
  const { user } = useAuth();
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);

    const setsSnap = await getDocs(
      query(collection(db, 'flashcard_sets'), orderBy('sort_order'))
    );
    const setsData = setsSnap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as FlashcardSet
    );

    if (user) {
      const progressSnap = await getDocs(
        query(
          collection(db, 'user_card_progress'),
          where('user_id', '==', user.uid),
          where('known', '==', true)
        )
      );

      // Build mastery map: set_id → known card count
      const masteryMap: Record<string, number> = {};
      progressSnap.docs.forEach((d) => {
        const setId = d.data().set_id as string;
        if (setId) masteryMap[setId] = (masteryMap[setId] || 0) + 1;
      });

      setSets(
        setsData.map((s) => ({ ...s, mastery_count: masteryMap[s.id] || 0 }))
      );
    } else {
      setSets(setsData.map((s) => ({ ...s, mastery_count: 0 })));
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { sets, loading, refresh: fetch };
}

// Fetch all cards for a specific set
export function useFlashcards(setId: string) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!setId) return;
    setLoading(true);

    getDocs(
      query(
        collection(db, 'flashcards'),
        where('set_id', '==', setId),
        orderBy('sort_order')
      )
    ).then((snap) => {
      setCards(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Flashcard));
      setLoading(false);
    });
  }, [setId]);

  return { cards, loading };
}

// Save card progress (know it / still learning)
// Stored as: /user_card_progress/{userId}_{cardId}
export function useSaveCardProgress() {
  const { user } = useAuth();

  return async (cardId: string, setId: string, known: boolean) => {
    if (!user) return;

    const docId = `${user.uid}_${cardId}`;
    await setDoc(
      doc(db, 'user_card_progress', docId),
      {
        user_id: user.uid,
        card_id: cardId,
        set_id: setId, // stored for mastery-map queries
        known,
        review_count: 1,
        last_reviewed: new Date().toISOString(),
      },
      { merge: true }
    );
  };
}

// Record a completed vocab session (full sessions only — call sites should
// skip this in review mode). Append-only: no doc id reuse, one row per run.
export function useSaveFlashcardSession() {
  const { user } = useAuth();

  return async (setId: string, score: number, total: number) => {
    if (!user) return;
    await addDoc(collection(db, 'user_flashcard_sessions'), {
      user_id: user.uid,
      set_id: setId,
      score,
      total,
      completed_at: new Date().toISOString(),
    });
  };
}

// Fetch a user's session history for one set — sorted newest first. No
// orderBy in the query itself (avoids needing a composite index); sorting
// happens client-side same as the rest of this file's date-based logic.
export function useFlashcardSessions(setId: string) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<FlashcardSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !setId) {
      setSessions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getDocs(
      query(
        collection(db, 'user_flashcard_sessions'),
        where('user_id', '==', user.uid),
        where('set_id', '==', setId)
      )
    ).then((snap) => {
      const data = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as FlashcardSession
      );
      data.sort((a, b) => (a.completed_at < b.completed_at ? 1 : -1));
      setSessions(data);
      setLoading(false);
    });
  }, [user, setId]);

  return { sessions, loading };
}

// Track/toggle a user's favorited flashcard sets.
// Stored as: /user_favorite_sets/{userId}_{setId}
export function useFavoriteSets() {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) {
      setFavoriteIds(new Set());
      setLoading(false);
      return;
    }
    setLoading(true);
    const snap = await getDocs(
      query(collection(db, 'user_favorite_sets'), where('user_id', '==', user.uid))
    );
    setFavoriteIds(new Set(snap.docs.map((d) => d.data().set_id as string)));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const toggleFavorite = useCallback(
    async (setId: string, isFavorited: boolean) => {
      if (!user) return;
      const docId = `${user.uid}_${setId}`;
      if (isFavorited) {
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(setId);
          return next;
        });
        await deleteDoc(doc(db, 'user_favorite_sets', docId));
      } else {
        setFavoriteIds((prev) => new Set(prev).add(setId));
        await setDoc(doc(db, 'user_favorite_sets', docId), {
          user_id: user.uid,
          set_id: setId,
          created_at: new Date().toISOString(),
        });
      }
    },
    [user]
  );

  return { favoriteIds, loading, toggleFavorite };
}

// Fetch a single random card (for Word of the Day)
export function useRandomCard() {
  const [card, setCard] = useState<Flashcard | null>(null);

  useEffect(() => {
    getDocs(collection(db, 'flashcards')).then((snap) => {
      const all = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Flashcard
      );
      if (all.length > 0) {
        setCard(all[Math.floor(Math.random() * all.length)]);
      }
    });
  }, []);

  return card;
}
