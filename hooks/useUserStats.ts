'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  collection, query, where,
  getDocs, getCountFromServer,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { xpProgress } from '@/lib/xp';

export type UserStats = {
  xp: number;
  level: number;
  xpIntoLevel: number;
  xpNeeded: number;
  xpProgress: number;
  cardsStudied: number;
  cardsKnown: number;
  totalCards: number;
  setsReviewed: number;
  totalSets: number;
  passagesDone: number;
  totalPassages: number;
  dialoguesDone: number;
  totalDialogues: number;
  grammarDone: number;
  totalGrammar: number;
};

const DEFAULT_STATS: UserStats = {
  xp: 0, level: 1, xpIntoLevel: 0, xpNeeded: 100, xpProgress: 0,
  cardsStudied: 0, cardsKnown: 0, totalCards: 0,
  setsReviewed: 0, totalSets: 0,
  passagesDone: 0, totalPassages: 0,
  dialoguesDone: 0, totalDialogues: 0,
  grammarDone: 0, totalGrammar: 0,
};

export function useUserStats() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);

    const [
      cardProgressSnap,
      totalCardsSnap,
      totalSetsSnap,
      passageProgressSnap,
      totalPassagesSnap,
      dialogueProgressSnap,
      totalDialoguesSnap,
      grammarProgressSnap,
      totalGrammarSnap,
    ] = await Promise.all([
      getDocs(query(collection(db, 'user_card_progress'), where('user_id', '==', user.uid))),
      getCountFromServer(collection(db, 'flashcards')),
      getCountFromServer(collection(db, 'flashcard_sets')),
      getDocs(query(collection(db, 'user_passage_progress'), where('user_id', '==', user.uid))),
      getCountFromServer(collection(db, 'passages')),
      getDocs(query(collection(db, 'user_dialogue_progress'), where('user_id', '==', user.uid))),
      getCountFromServer(collection(db, 'dialogues')),
      getDocs(query(collection(db, 'user_grammar_progress'), where('user_id', '==', user.uid))),
      getCountFromServer(collection(db, 'grammar_lessons')),
    ]);

    const cardDocs = cardProgressSnap.docs.map(d => d.data());
    const knownCards = cardDocs.filter(c => c.known).length;

    // Count distinct sets where at least one card is known
    const setsWithKnown = new Set(
      cardDocs.filter(c => c.known).map(c => c.set_id)
    ).size;

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
      setsReviewed: setsWithKnown,
      totalSets: totalSetsSnap.data().count,
      passagesDone: passageProgressSnap.docs.length,
      totalPassages: totalPassagesSnap.data().count,
      dialoguesDone: dialogueProgressSnap.docs.length,
      totalDialogues: totalDialoguesSnap.data().count,
      grammarDone: grammarProgressSnap.docs.length,
      totalGrammar: totalGrammarSnap.data().count,
    });

    setLoading(false);
  }, [user, profile]);

  useEffect(() => { fetch(); }, [fetch]);
  return { stats, loading, refresh: fetch };
}
