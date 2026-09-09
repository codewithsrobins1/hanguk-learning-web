'use client';
import { useEffect, useState, useCallback } from 'react';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { toMillis, countInRange, daysSinceLast } from '@/lib/weekly';
import { getWeekStartISO } from '@/lib/weekly';
import { WEEKLY_CATEGORIES } from '@/lib/weekly-goals';
export { WEEKLY_TARGETS } from '@/lib/weekly-goals';

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
  const [error, setError] = useState<string | null>(null);
  const resetAt = profile?.weekly_reset_at;
  const history = profile?.weekly_history;

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {

    const weekStart = Math.max(toMillis(getWeekStartISO()), toMillis(resetAt));

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

    const counts = {
      cardsReviewed: countSince(cardSnap.docs, 'last_reviewed'),
      passagesDone: countSince(passageSnap.docs, 'completed_at'),
      dialoguesDone: countSince(dialogueSnap.docs, 'completed_at'),
      listeningDone: countSince(listeningSnap.docs, 'completed_at'),
      patternsDone: countSince(patternSnap.docs, 'last_completed'),
      grammarDone: countSince(grammarSnap.docs, 'completed_at'),
    };
    const freshProfile = (await getDoc(doc(db, 'profiles', user.uid))).data();
    const recorded = freshProfile?.weekly_history?.[getWeekStartISO()] ?? history?.[getWeekStartISO()];
    for (const { key, field } of WEEKLY_CATEGORIES) {
      if (key !== 'cards' && recorded?.counts[key] !== undefined) {
        counts[field] = Math.max(0, recorded.counts[key]! - (recorded.baseline[key] ?? 0));
      }
    }
    setWeekly(counts);

    setDaysSince({
      cards: daysSinceLast(cardSnap.docs, 'last_reviewed'),
      passages: daysSinceLast(passageSnap.docs, 'completed_at'),
      dialogues: daysSinceLast(dialogueSnap.docs, 'completed_at'),
      listening: daysSinceLast(listeningSnap.docs, 'completed_at'),
      patterns: daysSinceLast(patternSnap.docs, 'last_completed'),
      grammar: daysSinceLast(grammarSnap.docs, 'completed_at'),
    });
    } catch (error) {
      console.error('Weekly progress unavailable:', error);
      setError('Could not load weekly progress. Please reload to try again.');
    } finally {
      setLoading(false);
    }
  }, [user, resetAt, history]);

  useEffect(() => { fetch(); }, [fetch]);
  return { weekly, daysSince, loading, error, refresh: fetch };
}
