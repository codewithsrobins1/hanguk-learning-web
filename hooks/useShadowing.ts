'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Dialogue } from '@/types';

export function useDialogues() {
  const [dialogues, setDialogues] = useState<Dialogue[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const snap = await getDocs(
      query(collection(db, 'dialogues'), orderBy('sort_order'))
    );
    setDialogues(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Dialogue));
    setLoading(false);
  }, []);

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
