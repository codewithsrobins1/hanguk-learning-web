'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { useFlashcardSets, useFlashcards } from '@/hooks/useFlashcards';
import { categoryColor } from '@/lib/category-colors';
import { FlashcardWithCloze } from '@/types';
import ProgressBar from '@/components/ProgressBar';

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function VocabDetailPage() {
  const { setId } = useParams<{ setId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { sets, loading: setsLoading } = useFlashcardSets();
  const { cards, loading: cardsLoading } = useFlashcards(setId);
  const [lastPracticed, setLastPracticed] = useState<Date | null>(null);

  useEffect(() => {
    if (!user || !setId) return;
    getDocs(
      query(
        collection(db, 'user_card_progress'),
        where('user_id', '==', user.uid),
        where('set_id', '==', setId)
      )
    ).then((snap) => {
      const dates = snap.docs.map((d) => d.data().last_reviewed as string).filter(Boolean);
      if (dates.length === 0) return;
      setLastPracticed(new Date(dates.reduce((a, b) => (a > b ? a : b))));
    });
  }, [user, setId]);

  if (setsLoading || cardsLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const set = sets.find((s) => s.id === setId);
  if (!set) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8">
      <p className="text-muted text-center">Set not found.</p>
      <button onClick={() => router.push('/cards')} className="bg-ink text-cream px-6 py-3 rounded-xl font-bold text-sm">
        Go Back
      </button>
    </div>
  );

  const mastered = set.mastery_count ?? 0;
  const total = set.card_count;
  const masteryPct = total > 0 ? Math.round((mastered / total) * 100) : 0;
  const previewCards = cards.slice(0, 2) as FlashcardWithCloze[];

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => router.push('/cards')} className="text-2xl text-muted hover:text-ink transition-colors">←</button>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
          style={{ backgroundColor: categoryColor(set.category) }}>
          {set.icon}
        </div>
        <h1 className="font-quicksand font-bold text-ink text-xl">{set.title}</h1>
      </div>

      {/* Stats card */}
      <div className="bg-white rounded-2xl p-5 mb-4" style={{ boxShadow: '0 3px 14px rgba(26,31,54,0.07)' }}>
        <div className="flex justify-between mb-4">
          <div>
            <p className="font-quicksand font-bold text-ink text-xl">{total}</p>
            <p className="text-xs text-muted">Total cards</p>
          </div>
          <div>
            <p className="font-quicksand font-bold text-xl" style={{ color: '#1E8E3E' }}>{mastered}</p>
            <p className="text-xs text-muted">Mastered</p>
          </div>
          <div>
            <p className="font-quicksand font-bold text-ink text-xl">{lastPracticed ? formatDate(lastPracticed) : '—'}</p>
            <p className="text-xs text-muted">Last practiced</p>
          </div>
        </div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-muted">Mastery</span>
          <span className="text-xs font-bold" style={{ color: '#1E8E3E' }}>{masteryPct}%</span>
        </div>
        <ProgressBar progress={total > 0 ? mastered / total : 0} color="#34A853" height={8} />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mb-6">
        <button
          onClick={() => router.push(`/cards/${setId}/session`)}
          className="btn-press-orange w-full py-4 rounded-2xl bg-orange text-white font-quicksand font-bold text-base"
        >
          Start Session
        </button>
        <button
          onClick={() => mastered > 0 && router.push(`/cards/${setId}/session?mode=review`)}
          disabled={mastered === 0}
          className="w-full py-3.5 rounded-2xl border-[1.5px] border-border font-bold text-sm text-ink hover:bg-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Review mastered cards
        </button>
      </div>

      {/* Card preview */}
      {previewCards.length > 0 && (
        <>
          <p className="text-[11px] font-bold text-muted tracking-widest mb-3">CARD PREVIEW</p>
          <div className="flex flex-col gap-2.5">
            {previewCards.map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-border px-4 py-3.5">
                <p className="font-semibold text-ink" style={{ fontFamily: 'Noto Sans KR, sans-serif', fontSize: 15 }}>
                  {c.cloze_sentence}
                </p>
                <p className="text-xs text-muted mt-1">{c.cloze_translation}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
