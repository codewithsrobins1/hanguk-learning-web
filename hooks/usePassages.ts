'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { Passage, ComprehensionQuestion, UserPassageProgress, WordBankEntry } from '@/types';

// Fetch all passages with user's completion status
export function usePassages() {
  const { user } = useAuth();
  const [passages, setPassages] = useState<
    (Passage & { done?: boolean; score?: string })[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);

    const passageSnap = await getDocs(
      query(collection(db, 'passages'), orderBy('sort_order'))
    );
    const passageData = passageSnap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as Passage
    );

    if (user) {
      const progressSnap = await getDocs(
        query(
          collection(db, 'user_passage_progress'),
          where('user_id', '==', user.uid)
        )
      );
      const progressMap: Record<string, UserPassageProgress> = {};
      progressSnap.docs.forEach((d) => {
        const p = d.data() as UserPassageProgress;
        progressMap[p.passage_id] = p;
      });

      setPassages(
        passageData.map((p) => {
          const prog = progressMap[p.id];
          return {
            ...p,
            done: !!prog,
            score: prog ? `${prog.score}/${prog.total_questions}` : undefined,
          };
        })
      );
    } else {
      setPassages(passageData);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { passages, loading, refresh: fetch };
}

// Fetch a single passage with its comprehension questions
export function usePassageDetail(passageId: string) {
  const [passage, setPassage] = useState<Passage | null>(null);
  const [questions, setQuestions] = useState<ComprehensionQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!passageId) return;
    setLoading(true);

    Promise.all([
      getDoc(doc(db, 'passages', passageId)),
      getDocs(
        query(
          collection(db, 'comprehension_questions'),
          where('passage_id', '==', passageId),
          orderBy('sort_order')
        )
      ),
    ]).then(([passageSnap, questionsSnap]) => {
      setPassage(
        passageSnap.exists()
          ? ({ id: passageSnap.id, ...passageSnap.data() } as Passage)
          : null
      );
      setQuestions(
        questionsSnap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as ComprehensionQuestion
        )
      );
      setLoading(false);
    });
  }, [passageId]);

  return { passage, questions, loading };
}

// Save passage quiz score
// Stored as: /user_passage_progress/{userId}_{passageId}
export function useSavePassageProgress() {
  const { user } = useAuth();

  return async (passageId: string, score: number, totalQuestions: number) => {
    if (!user) return;

    const docId = `${user.uid}_${passageId}`;
    await setDoc(
      doc(db, 'user_passage_progress', docId),
      {
        user_id: user.uid,
        passage_id: passageId,
        score,
        total_questions: totalQuestions,
        completed_at: new Date().toISOString(),
      },
      { merge: true }
    );
  };
}

// Per-passage word bank: tap a word in the passage, get a contextual
// definition (via /api/read/define), save it here. Scoped to
// user + passage — deliberately no global word bank across passages.
export function useWordBank(passageId: string) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<WordBankEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEntries = useCallback(async () => {
    if (!user || !passageId) {
      setEntries([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const snap = await getDocs(
      query(
        collection(db, 'user_wordbank_entries'),
        where('user_id', '==', user.uid),
        where('passage_id', '==', passageId)
      )
    );
    setEntries(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as WordBankEntry));
    setLoading(false);
  }, [user, passageId]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const addWord = useCallback(
    async (word: string, sentence: string): Promise<{ error?: string }> => {
      if (!user) return { error: 'Not signed in' };
      if (entries.some((e) => e.word === word)) return {};

      try {
        const res = await fetch('/api/read/define', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ word, sentence }),
        });
        if (!res.ok) throw new Error('Definition request failed');
        const { definition } = await res.json();

        const created_at = new Date().toISOString();
        const docRef = await addDoc(collection(db, 'user_wordbank_entries'), {
          user_id: user.uid,
          passage_id: passageId,
          word,
          definition,
          sentence,
          created_at,
        });

        setEntries((prev) => [
          ...prev,
          { id: docRef.id, user_id: user.uid, passage_id: passageId, word, definition, sentence, created_at },
        ]);
        return {};
      } catch (e) {
        console.error('Failed to add word to word bank:', e);
        return { error: 'Failed to add word' };
      }
    },
    [user, passageId, entries]
  );

  const removeWord = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'user_wordbank_entries', id));
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { entries, loading, addWord, removeWord };
}
