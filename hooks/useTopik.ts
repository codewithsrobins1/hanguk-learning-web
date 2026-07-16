'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  collection, query, orderBy,
  getDocs, doc, getDoc, setDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';

export type TopikReadingQuestion = {
  type: 'fill_blank' | 'reading_comprehension' | 'grammar';
  passage: string | null;
  question: string;
  options: string[];
  answer_index: number;
};

export type TopikListeningQuestion = {
  script: string;
  question: string;
  options: string[];
  answer_index: number;
  audio_url?: string;
};

export type TopikTest = {
  id: string;
  level: number;
  version: string;
  title: string;
  reading_questions: TopikReadingQuestion[];
  listening_questions: TopikListeningQuestion[];
};

export type DotColor = 'green' | 'orange' | 'red';

export type LevelAttempt = {
  score: number;
  dot_color: DotColor;
  date: string;
  test_id: string;
};

export type LevelProgress = {
  attempts: LevelAttempt[];
  total_attempts: number;
  unlocked_next: boolean;
};

export type TopikProgressDoc = {
  user_id: string;
  level_progress: Record<string, LevelProgress>;
  highest_level_passed: number;
};

export type PlacementResult = {
  recommended_level: number;
};

export function topikTestId(level: number, version: string) {
  return `topik_l${level}_${version.toLowerCase()}`;
}

const EMPTY_LEVEL_PROGRESS: LevelProgress = {
  attempts: [],
  total_attempts: 0,
  unlocked_next: false,
};

export function getLevelProgress(
  progress: TopikProgressDoc | null,
  level: number
): LevelProgress {
  return progress?.level_progress?.[String(level)] ?? EMPTY_LEVEL_PROGRESS;
}

export function isLevelUnlocked(progress: TopikProgressDoc | null, level: number) {
  if (level <= 1) return true;
  return getLevelProgress(progress, level - 1).unlocked_next;
}

export function bestScore(lp: LevelProgress): number | null {
  if (lp.attempts.length === 0) return null;
  return Math.max(...lp.attempts.map((a) => a.score));
}

export function nextVersionForLevel(lp: LevelProgress): string {
  return lp.total_attempts % 2 === 0 ? 'A' : 'B';
}

export function useTopikTests() {
  const [tests, setTests] = useState<TopikTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, 'topik_tests'), orderBy('level')))
      .then((snap) => {
        const raw = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TopikTest);
        raw.sort((a, b) => a.level - b.level || a.version.localeCompare(b.version));
        setTests(raw);
      })
      .catch((e) => console.error('Failed to load TOPIK tests:', e))
      .finally(() => setLoading(false));
  }, []);

  return { tests, loading };
}

export function useTopikTest(testId: string) {
  const [test, setTest] = useState<TopikTest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!testId) return;
    setLoading(true);
    getDoc(doc(db, 'topik_tests', testId))
      .then((snap) => {
        setTest(snap.exists() ? ({ id: snap.id, ...snap.data() } as TopikTest) : null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [testId]);

  return { test, loading };
}

export function useTopikProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<TopikProgressDoc | null>(null);
  const [placement, setPlacement] = useState<PlacementResult | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) {
      setProgress(null);
      setPlacement(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [pSnap, plSnap] = await Promise.all([
        getDoc(doc(db, 'topik_progress', user.uid)),
        getDoc(doc(db, 'placement_attempts', user.uid)),
      ]);
      setProgress(pSnap.exists() ? (pSnap.data() as TopikProgressDoc) : null);
      setPlacement(plSnap.exists() ? (plSnap.data() as PlacementResult) : null);
    } catch (e) {
      console.error('Failed to load TOPIK progress:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);
  return { progress, placement, loading, refresh: fetch };
}

export async function saveTopikAttempt(
  userId: string,
  test: TopikTest,
  readingScore: number,
  listeningScore: number,
  timeTaken: number
) {
  const level = test.level;
  const levelKey = String(level);
  const progressRef = doc(db, 'topik_progress', userId);
  const progressSnap = await getDoc(progressRef);
  const existingDoc = progressSnap.exists() ? (progressSnap.data() as TopikProgressDoc) : null;
  const existing = existingDoc?.level_progress?.[levelKey] ?? EMPTY_LEVEL_PROGRESS;

  const attemptNumber = existing.total_attempts + 1;
  const totalScore = readingScore + listeningScore;
  const percent = Math.round((totalScore / 20) * 100);
  const dotColor: DotColor = percent >= 90 ? 'green' : percent >= 80 ? 'orange' : 'red';

  await setDoc(doc(db, 'topik_attempts', `${userId}_${test.id}_${attemptNumber}`), {
    user_id: userId,
    test_id: test.id,
    attempt_number: attemptNumber,
    score: percent,
    reading_score: readingScore,
    listening_score: listeningScore,
    completed_at: serverTimestamp(),
    time_taken: timeTaken,
  });

  const newAttempts = [
    ...existing.attempts,
    { score: percent, dot_color: dotColor, date: new Date().toISOString(), test_id: test.id },
  ].slice(-3);
  const greenCount = newAttempts.filter((a) => a.dot_color === 'green').length;
  const unlockedNext = existing.unlocked_next || greenCount >= 2;

  const newLevelProgress: Record<string, LevelProgress> = {
    ...(existingDoc?.level_progress ?? {}),
    [levelKey]: { attempts: newAttempts, total_attempts: attemptNumber, unlocked_next: unlockedNext },
  };
  const highestLevelPassed = Object.entries(newLevelProgress)
    .filter(([, lp]) => lp.unlocked_next)
    .reduce((max, [lvl]) => Math.max(max, Number(lvl)), existingDoc?.highest_level_passed ?? 0);

  await setDoc(progressRef, {
    user_id: userId,
    level_progress: newLevelProgress,
    highest_level_passed: highestLevelPassed,
  }, { merge: true });

  return { attemptNumber, dotColor, percent, unlockedNext, readingScore, listeningScore };
}

export async function savePlacementResult(userId: string, recommendedLevel: number) {
  await setDoc(doc(db, 'placement_attempts', userId), {
    user_id: userId,
    recommended_level: recommendedLevel,
    completed_at: serverTimestamp(),
  });
}
