'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  collection, query, orderBy, where,
  getDocs, doc, getDoc, setDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';

export type ListeningLine = {
  speaker: string;
  korean: string;
  translation: string;
};

export type ListeningSegment = {
  segment_index: number;
  lines: ListeningLine[];
  audio_url: string;
  question: string;
  options: string[];
  answer_index: number;
};

export type ListeningExercise = {
  id: string;
  title: string;
  title_ko: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  sort_order: number;
  segments: ListeningSegment[];
};

export type ExerciseWithProgress = ListeningExercise & {
  completed_at: Date | null;
  score: number | null;
  total: number | null;
};

export function useListeningExercises() {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<ExerciseWithProgress[]>([]);
  const [loading, setLoading]     = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, 'listening_exercises'), orderBy('sort_order'))
      );
      const raw = snap.docs.map(d => ({ id: d.id, ...d.data() }) as ListeningExercise);

      const progressMap: Record<string, { completed_at: Date; score: number; total: number }> = {};
      if (user) {
        try {
          const pSnap = await getDocs(
            query(collection(db, 'user_listening_progress'), where('user_id', '==', user.uid))
          );
          pSnap.docs.forEach(d => {
            const data = d.data();
            if (data.completed_at) {
              progressMap[data.exercise_id] = {
                completed_at: data.completed_at.toDate(),
                score:        data.score,
                total:        data.total,
              };
            }
          });
        } catch (e) {}
      }

      setExercises(raw.map(ex => ({
        ...ex,
        completed_at: progressMap[ex.id]?.completed_at ?? null,
        score:        progressMap[ex.id]?.score        ?? null,
        total:        progressMap[ex.id]?.total        ?? null,
      })));
    } catch (e) {
      console.error('Failed to load listening exercises:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);
  return { exercises, loading, refresh: fetch };
}

export function useListeningExercise(exerciseId: string) {
  const [exercise, setExercise] = useState<ListeningExercise | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!exerciseId) return;
    setLoading(true);
    getDoc(doc(db, 'listening_exercises', exerciseId)).then(snap => {
      setExercise(snap.exists() ? ({ id: snap.id, ...snap.data() } as ListeningExercise) : null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [exerciseId]);

  return { exercise, loading };
}

export async function saveListeningProgress(
  userId:     string,
  exerciseId: string,
  score:      number,
  total:      number
) {
  const docId = `${userId}_${exerciseId}`;
  await setDoc(doc(db, 'user_listening_progress', docId), {
    user_id:     userId,
    exercise_id: exerciseId,
    score,
    total,
    completed_at: serverTimestamp(),
  }, { merge: true });
}
