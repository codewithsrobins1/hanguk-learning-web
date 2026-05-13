'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  collection, query, orderBy, where,
  getDocs, getDoc, doc, setDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';

// ── Types ────────────────────────────────────────────────────────
export type GrammarLesson = {
  id: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  sort_order: number;
  title_ko: string;
  title_en: string;
  explanation: string;
  examples: { korean: string; translation: string }[];
};

export type GrammarQuestion = {
  id: string;
  lesson_id: string;
  sort_order: number;
  prompt: string;
  options: string[];
  answer_index: number;
};

export type LessonWithProgress = GrammarLesson & {
  completed_at: Date | null;
  score: number | null;
  total: number | null;
};

export type MilestoneResult = {
  milestone_id: string;
  passed: boolean;
  score: number;
  total: number;
  completed_at: Date;
};

// ── Lesson hooks ─────────────────────────────────────────────────
export function useGrammarLessons() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<LessonWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'grammar_lessons'), orderBy('sort_order')));
      const raw = snap.docs.map(d => ({ id: d.id, ...d.data() }) as GrammarLesson);

      const progressMap: Record<string, { completed_at: Date; score: number; total: number }> = {};
      if (user) {
        try {
          const progressSnap = await getDocs(
            query(collection(db, 'user_grammar_progress'), where('user_id', '==', user.uid))
          );
          progressSnap.docs.forEach(d => {
            const data = d.data();
            if (data.completed_at) {
              progressMap[data.lesson_id] = {
                completed_at: data.completed_at.toDate(),
                score: data.score,
                total: data.total,
              };
            }
          });
        } catch (e) {}
      }

      setLessons(raw.map(l => ({
        ...l,
        completed_at: progressMap[l.id]?.completed_at ?? null,
        score: progressMap[l.id]?.score ?? null,
        total: progressMap[l.id]?.total ?? null,
      })));
    } catch (e) {
      console.error('Failed to load grammar lessons:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);
  return { lessons, loading, refresh: fetch };
}

export function useGrammarLesson(lessonId: string) {
  const [lesson, setLesson] = useState<GrammarLesson | null>(null);
  const [questions, setQuestions] = useState<GrammarQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lessonId) return;
    setLoading(true);
    Promise.all([
      getDoc(doc(db, 'grammar_lessons', lessonId)).then(snap =>
        snap.exists() ? ({ id: snap.id, ...snap.data() } as GrammarLesson) : null
      ),
      getDocs(query(
        collection(db, 'grammar_questions'),
        where('lesson_id', '==', lessonId),
        orderBy('sort_order')
      )),
    ]).then(([lessonData, qSnap]) => {
      setLesson(lessonData);
      setQuestions(qSnap.docs.map(d => ({ id: d.id, ...d.data() }) as GrammarQuestion));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [lessonId]);

  return { lesson, questions, loading };
}

export async function saveGrammarProgress(
  userId: string,
  lessonId: string,
  score: number,
  total: number
) {
  const docId = `${userId}_${lessonId}`;
  await setDoc(doc(db, 'user_grammar_progress', docId), {
    user_id: userId,
    lesson_id: lessonId,
    score,
    total,
    completed_at: serverTimestamp(),
  }, { merge: true });
}

// ── Milestone hooks ──────────────────────────────────────────────
export function useMilestoneResults() {
  const { user } = useAuth();
  const [results, setResults] = useState<Record<string, MilestoneResult>>({});
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, 'milestone_results'), where('user_id', '==', user.uid))
      );
      const map: Record<string, MilestoneResult> = {};
      snap.docs.forEach(d => {
        const data = d.data();
        map[data.milestone_id] = {
          ...data,
          completed_at: data.completed_at?.toDate(),
        } as MilestoneResult;
      });
      setResults(map);
    } catch (e) {}
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);
  return { results, loading, refresh: fetch };
}

// Parse milestone_beg_2 → { prefix: 'beg', group: 2, lessonIds: [...] }
export function parseMilestoneId(milestoneId: string) {
  const parts = milestoneId.split('_');
  const prefix = parts[1]; // beg | int | adv
  const group = parseInt(parts[2]);
  const lessonIds = Array.from({ length: 5 }, (_, i) =>
    `lesson_${prefix}_${(group - 1) * 5 + i + 1}`
  );
  return { prefix, group, lessonIds };
}

export function useMilestoneQuestions(milestoneId: string) {
  const [questions, setQuestions] = useState<GrammarQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!milestoneId) return;
    setLoading(true);
    const { lessonIds } = parseMilestoneId(milestoneId);

    getDocs(query(
      collection(db, 'grammar_questions'),
      where('lesson_id', 'in', lessonIds)
    )).then(snap => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }) as GrammarQuestion);
      // Pick 4 random questions from the pool
      const shuffled = [...all].sort(() => Math.random() - 0.5);
      setQuestions(shuffled.slice(0, 4));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [milestoneId]);

  return { questions, loading };
}

export async function saveMilestoneResult(
  userId: string,
  milestoneId: string,
  score: number,
  total: number
): Promise<boolean> {
  const passed = score >= 3;
  const docId = `${userId}_${milestoneId}`;
  await setDoc(doc(db, 'milestone_results', docId), {
    user_id: userId,
    milestone_id: milestoneId,
    passed,
    score,
    total,
    completed_at: serverTimestamp(),
  }, { merge: true });
  return passed;
}
