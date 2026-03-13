import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type ChangelogEntry = {
  id: string;
  date: string;
  section: string;
  icon: string;
  description: string;
};

export function useChangelog() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const snap = await getDocs(
        query(collection(db, 'changelog'), orderBy('date', 'desc'))
      );
      setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() } as ChangelogEntry)));
      setLoading(false);
    }
    fetch();
  }, []);

  return { entries, loading };
}
