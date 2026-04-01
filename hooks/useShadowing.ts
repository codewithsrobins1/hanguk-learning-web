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
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { Dialogue } from '@/types';

export type DialogueWithProgress = Dialogue & {
  completed_at: Date | null;
};

export function useDialogues() {
  const { user } = useAuth();
  const [dialogues, setDialogues] = useState<DialogueWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, 'dialogues'), orderBy('sort_order'))
      );
      const raw = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Dialogue);

      const progressMap: Record<string, Date> = {};
      if (user) {
        try {
          const progressSnap = await getDocs(
            query(
              collection(db, 'user_dialogue_progress'),
              where('user_id', '==', user.uid)
            )
          );
          progressSnap.docs.forEach((d) => {
            const data = d.data();
            if (data.completed_at)
              progressMap[data.dialogue_id] = data.completed_at.toDate();
          });
        } catch (e) {}
      }

      setDialogues(
        raw.map((d) => ({ ...d, completed_at: progressMap[d.id] ?? null }))
      );
    } catch (e) {
      console.error('Failed to load dialogues:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { dialogues, loading, refresh: fetch };
}

export function useDialogue(dialogueId: string) {
  const [dialogue, setDialogue] = useState<Dialogue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dialogueId) return;
    setLoading(true);
    getDoc(doc(db, 'dialogues', dialogueId)).then((snap) => {
      setDialogue(
        snap.exists() ? ({ id: snap.id, ...snap.data() } as Dialogue) : null
      );
      setLoading(false);
    });
  }, [dialogueId]);

  return { dialogue, loading };
}

export async function saveDialogueProgress(userId: string, dialogueId: string) {
  const docId = `${userId}_${dialogueId}`;
  await setDoc(
    doc(db, 'user_dialogue_progress', docId),
    {
      user_id: userId,
      dialogue_id: dialogueId,
      completed_at: serverTimestamp(),
    },
    { merge: true }
  );
}
