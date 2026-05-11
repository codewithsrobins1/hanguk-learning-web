'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';

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

export function useGrammarLessons() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<LessonWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, 'grammar_lessons'), orderBy('sort_order'))
      );
      const raw = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as GrammarLesson
      );

      const progressMap: Record<
        string,
        { completed_at: Date; score: number; total: number }
      > = {};
      if (user) {
        try {
          const progressSnap = await getDocs(
            query(
              collection(db, 'user_grammar_progress'),
              where('user_id', '==', user.uid)
            )
          );
          progressSnap.docs.forEach((d) => {
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

      setLessons(
        raw.map((l) => ({
          ...l,
          completed_at: progressMap[l.id]?.completed_at ?? null,
          score: progressMap[l.id]?.score ?? null,
          total: progressMap[l.id]?.total ?? null,
        }))
      );
    } catch (e) {
      console.error('Failed to load grammar lessons:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetch();
  }, [fetch]);
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
      getDoc(doc(db, 'grammar_lessons', lessonId)).then((snap) => {
        return snap.exists()
          ? ({ id: snap.id, ...snap.data() } as GrammarLesson)
          : null;
      }),
      getDocs(
        query(
          collection(db, 'grammar_questions'),
          where('lesson_id', '==', lessonId),
          orderBy('sort_order')
        )
      ).then((snap) => {
        return snap;
      }),
    ])
      .then(([lessonData, qSnap]) => {
        setLesson(lessonData);
        setQuestions(
          qSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as GrammarQuestion)
        );
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
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
  await setDoc(
    doc(db, 'user_grammar_progress', docId),
    {
      user_id: userId,
      lesson_id: lessonId,
      score,
      total,
      completed_at: serverTimestamp(),
    },
    { merge: true }
  );
}
