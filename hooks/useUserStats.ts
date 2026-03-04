'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';

type UserStats = {
  streak: number;
  cardsStudied: number;
  cardsKnown: number;
  totalCards: number;
  passagesDone: number;
  totalPassages: number;
  hangulKnown: number;
};

export function useUserStats() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    streak: 0,
    cardsStudied: 0,
    cardsKnown: 0,
    totalCards: 0,
    passagesDone: 0,
    totalPassages: 0,
    hangulKnown: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const [
      cardProgressSnap,
      totalCardsSnap,
      passageProgressSnap,
      totalPassagesSnap,
    ] = await Promise.all([
      getDocs(
        query(
          collection(db, 'user_card_progress'),
          where('user_id', '==', user.uid)
        )
      ),
      getCountFromServer(collection(db, 'flashcards')),
      getDocs(
        query(
          collection(db, 'user_passage_progress'),
          where('user_id', '==', user.uid)
        )
      ),
      getCountFromServer(collection(db, 'passages')),
    ]);

    const cardDocs = cardProgressSnap.docs.map((d) => d.data());
    const knownCards = cardDocs.filter((c) => c.known).length;

    setStats({
      streak: profile?.current_streak ?? 0,
      cardsStudied: cardDocs.length,
      cardsKnown: knownCards,
      totalCards: totalCardsSnap.data().count,
      passagesDone: passageProgressSnap.docs.length,
      totalPassages: totalPassagesSnap.data().count,
      hangulKnown: 14, // Can be tracked later if hangul progress is added to DB
    });

    setLoading(false);
  }, [user, profile]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { stats, loading, refresh: fetch };
}
