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
import { xpProgress } from '@/lib/xp';

type UserStats = {
  xp: number;
  level: number;
  xpIntoLevel: number;
  xpNeeded: number;
  xpProgress: number;
  cardsStudied: number;
  cardsKnown: number;
  totalCards: number;
  passagesDone: number;
  totalPassages: number;
};

export function useUserStats() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    xp: 0,
    level: 1,
    xpIntoLevel: 0,
    xpNeeded: 100,
    xpProgress: 0,
    cardsStudied: 0,
    cardsKnown: 0,
    totalCards: 0,
    passagesDone: 0,
    totalPassages: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);

    const [cardProgressSnap, totalCardsSnap, passageProgressSnap, totalPassagesSnap] =
      await Promise.all([
        getDocs(query(collection(db, 'user_card_progress'), where('user_id', '==', user.uid))),
        getCountFromServer(collection(db, 'flashcards')),
        getDocs(query(collection(db, 'user_passage_progress'), where('user_id', '==', user.uid))),
        getCountFromServer(collection(db, 'passages')),
      ]);

    const cardDocs = cardProgressSnap.docs.map(d => d.data());
    const knownCards = cardDocs.filter(c => c.known).length;
    const xp = profile?.xp ?? 0;
    const prog = xpProgress(xp);

    setStats({
      xp,
      level: prog.level,
      xpIntoLevel: prog.xpIntoLevel,
      xpNeeded: prog.xpNeeded,
      xpProgress: prog.progress,
      cardsStudied: cardDocs.length,
      cardsKnown: knownCards,
      totalCards: totalCardsSnap.data().count,
      passagesDone: passageProgressSnap.docs.length,
      totalPassages: totalPassagesSnap.data().count,
    });

    setLoading(false);
  }, [user, profile]);

  useEffect(() => { fetch(); }, [fetch]);

  return { stats, loading, refresh: fetch };
}
