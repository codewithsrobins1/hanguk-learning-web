'use client';
import { useEffect, useState, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { toMillis, countInRange, daysSinceLast } from '@/lib/weekly';

export type WeeklyProgress = {
  cardsReviewed: number;
  passagesDone: number;
  dialoguesDone: number;
  listeningDone: number;
  patternsDone: number;
  grammarDone: number;
};

// Days since the most recent activity in each category, regardless of week
// boundary — null means the category has never been touched.
export type DaysSinceActivity = {
  cards: number | null;
  passages: number | null;
  dialogues: number | null;
  listening: number | null;
  patterns: number | null;
  grammar: number | null;
};

// Bars fill toward these as activity happens — not user-facing "goals",
// just a sensible weekly pace so the bar has something to fill toward.
export const WEEKLY_TARGETS = { cards: 15, passages: 3, dialogues: 2, listening: 3, patterns: 5, grammar: 3 };

const DEFAULT_WEEKLY: WeeklyProgress = {
  cardsReviewed: 0, passagesDone: 0, dialoguesDone: 0, listeningDone: 0, patternsDone: 0, grammarDone: 0,
};

const DEFAULT_DAYS_SINCE: DaysSinceActivity = {
  cards: null, passages: null, dialogues: null, listening: null, patterns: null, grammar: null,
};

export function useWeeklyProgress() {
  const { user, profile } = useAuth();
  const [weekly, setWeekly] = useState<WeeklyProgress>(DEFAULT_WEEKLY);
  const [daysSince, setDaysSince] = useState<DaysSinceActivity>(DEFAULT_DAYS_SINCE);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);

    const weekStart = profile?.weekly_reset_at ? toMillis(profile.weekly_reset_at) : 0;

    const [cardSnap, passageSnap, dialogueSnap, listeningSnap, patternSnap, grammarSnap] = await Promise.all([
      getDocs(query(collection(db, 'user_card_progress'), where('user_id', '==', user.uid))),
      getDocs(query(collection(db, 'user_passage_progress'), where('user_id', '==', user.uid))),
      getDocs(query(collection(db, 'user_dialogue_progress'), where('user_id', '==', user.uid))),
      getDocs(query(collection(db, 'user_listening_progress'), where('user_id', '==', user.uid))),
      getDocs(query(collection(db, 'user_pattern_progress'), where('user_id', '==', user.uid))),
      getDocs(query(collection(db, 'user_grammar_progress'), where('user_id', '==', user.uid))),
    ]);

    const countSince = (docs: { data: () => any }[], field: string) =>
      countInRange(docs, field, weekStart, Infinity);

    setWeekly({
      cardsReviewed: countSince(cardSnap.docs, 'last_reviewed'),
      passagesDone: countSince(passageSnap.docs, 'completed_at'),
      dialoguesDone: countSince(dialogueSnap.docs, 'completed_at'),
      listeningDone: countSince(listeningSnap.docs, 'completed_at'),
      patternsDone: countSince(patternSnap.docs, 'last_completed'),
      grammarDone: countSince(grammarSnap.docs, 'completed_at'),
    });

    setDaysSince({
      cards: daysSinceLast(cardSnap.docs, 'last_reviewed'),
      passages: daysSinceLast(passageSnap.docs, 'completed_at'),
      dialogues: daysSinceLast(dialogueSnap.docs, 'completed_at'),
      listening: daysSinceLast(listeningSnap.docs, 'completed_at'),
      patterns: daysSinceLast(patternSnap.docs, 'last_completed'),
      grammar: daysSinceLast(grammarSnap.docs, 'completed_at'),
    });

    setLoading(false);
  }, [user, profile?.weekly_reset_at]);

  useEffect(() => { fetch(); }, [fetch]);
  return { weekly, daysSince, loading, refresh: fetch };
}
