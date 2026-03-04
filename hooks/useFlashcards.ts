'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { FlashcardSet, Flashcard } from '@/types';

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
