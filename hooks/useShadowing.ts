'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  collection, query, orderBy, getDocs,
  doc, getDoc, setDoc, where, serverTimestamp, increment, updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { Dialogue } from '@/types';

export type DialogueWithProgress = Dialogue & {
  completed_at: Date | null;
  best_score:   number | null;
};

export function useDialogues() {
  const { user } = useAuth();
  const [dialogues, setDialogues] = useState<DialogueWithProgress[]>([]);
  const [loading, setLoading]     = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'dialogues'), orderBy('sort_order')));
      const raw  = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Dialogue);

      const completedMap:  Record<string, Date>   = {};
      const bestScoreMap:  Record<string, number> = {};

      if (user) {
        try {
          const progressSnap = await getDocs(
            query(collection(db, 'user_dialogue_progress'), where('user_id', '==', user.uid))
          );
          progressSnap.docs.forEach(d => {
            const data = d.data();
            if (data.completed_at) completedMap[data.dialogue_id]  = data.completed_at.toDate();
            if (data.best_score != null) bestScoreMap[data.dialogue_id] = data.best_score;
          });
        } catch (e) {}
      }

      setDialogues(raw.map(d => ({
        ...d,
        completed_at: completedMap[d.id]  ?? null,
        best_score:   bestScoreMap[d.id]  ?? null,
      })));
    } catch (e) {
      console.error('Failed to load dialogues:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);
  return { dialogues, loading, refresh: fetch };
}

export function useDialogue(dialogueId: string) {
  const [dialogue, setDialogue] = useState<Dialogue | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!dialogueId) return;
    setLoading(true);
    getDoc(doc(db, 'dialogues', dialogueId)).then(snap => {
      setDialogue(snap.exists() ? ({ id: snap.id, ...snap.data() } as Dialogue) : null);
      setLoading(false);
    });
  }, [dialogueId]);

  return { dialogue, loading };
}

export async function saveDialogueProgress(
  userId:     string,
  dialogueId: string,
  newScore?:  number        // optional — only passed when a graded session completes
) {
  const docId  = `${userId}_${dialogueId}`;
  const ref    = doc(db, 'user_dialogue_progress', docId);
  const snap   = await getDoc(ref);
  const currentBest: number = snap.exists() ? (snap.data().best_score ?? 0) : 0;
  const updatedBest = newScore != null ? Math.max(currentBest, newScore) : currentBest;

  await setDoc(ref, {
    user_id:      userId,
    dialogue_id:  dialogueId,
    completed_at: serverTimestamp(),
    best_score:   updatedBest,
  }, { merge: true });

  // Increment total session counter on profile for goal tracking
  await updateDoc(doc(db, 'profiles', userId), {
    dialogue_sessions: increment(1),
  });
}
