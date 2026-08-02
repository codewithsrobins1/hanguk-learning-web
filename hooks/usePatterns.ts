'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  collection, query, orderBy, where,
  getDocs, doc, getDoc, setDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';

export type PatternQuestion = {
  slot:               string;
  slot_translation:   string;
  context:            string;
  full_sentence:      string;
  sentence_translation: string;
  options:            string[];
  answer_index:       number;
};

export type PatternRound = {
  round:     number;
  questions: PatternQuestion[];
};

export type PatternExample = {
  korean:      string;
  translation: string;
};

export type PatternStemExample = {
  base:   string;
  stem:   string;
  result: string; // the base word fully conjugated with this pattern, e.g. "갈 수 없어요"
};

export type Pattern = {
  id:                string;
  category:          string;
  tier:              'Survival' | 'Conversational' | 'Fluency';
  sort_order:        number;
  frame:             string;
  frame_translation: string;
  explanation:       string;
  rule?:             string;
  examples?:         PatternExample[];
  stem_examples?:    PatternStemExample[];
  rounds:            PatternRound[];
};

export type PatternWithProgress = Pattern & {
  rounds_completed: number;
  last_completed:   Date | null;
};

export function usePatterns() {
  const { user } = useAuth();
  const [patterns, setPatterns] = useState<PatternWithProgress[]>([]);
  const [loading, setLoading]   = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'patterns'), orderBy('sort_order')));
      const raw  = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Pattern);

      const progressMap: Record<string, { rounds_completed: number; last_completed: Date }> = {};
      if (user) {
        try {
          const pSnap = await getDocs(
            query(collection(db, 'user_pattern_progress'), where('user_id', '==', user.uid))
          );
          pSnap.docs.forEach(d => {
            const data = d.data();
            progressMap[data.pattern_id] = {
              rounds_completed: data.rounds_completed ?? 0,
              last_completed:   data.last_completed?.toDate() ?? null,
            };
          });
        } catch (e) {}
      }

      setPatterns(raw.map(p => ({
        ...p,
        rounds_completed: progressMap[p.id]?.rounds_completed ?? 0,
        last_completed:   progressMap[p.id]?.last_completed   ?? null,
      })));
    } catch (e) {
      console.error('Failed to load patterns:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);
  return { patterns, loading, refresh: fetch };
}

export function usePattern(patternId: string) {
  const [pattern, setPattern] = useState<Pattern | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patternId) return;
    setLoading(true);
    getDoc(doc(db, 'patterns', patternId)).then(snap => {
      setPattern(snap.exists() ? ({ id: snap.id, ...snap.data() } as Pattern) : null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [patternId]);

  return { pattern, loading };
}

export async function savePatternProgress(
  userId:           string,
  patternId:        string,
  roundsCompleted:  number
) {
  const docId = `${userId}_${patternId}`;
  await setDoc(doc(db, 'user_pattern_progress', docId), {
    user_id:          userId,
    pattern_id:       patternId,
    rounds_completed: roundsCompleted,
    last_completed:   serverTimestamp(),
  }, { merge: true });
}
