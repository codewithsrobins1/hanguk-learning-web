'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFlashcardSets, useFlashcardSessions, useFlashcards } from '@/hooks/useFlashcards';
import { categoryColor } from '@/lib/category-colors';
import ProgressBar from '@/components/ProgressBar';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Quick glossary modal — lets a learner glance over every target word in
// the set (and its meaning in context) before starting the quiz, rather
// than only meeting each word cold mid-session.
function WordListModal({
  cards,
  onClose,
}: {
  cards: { id: string; sentence_parts: string[]; key_index: number; translation: string }[];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h2 className="font-extrabold text-ink text-base">Words in this set</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-muted hover:text-ink text-lg flex-shrink-0"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto">
          {cards.map((c) => (
            <div key={c.id} className="bg-cream rounded-xl px-4 py-3">
              <p
                className="font-bold text-ink"
                style={{ fontFamily: 'Noto Sans KR, sans-serif', fontSize: 16 }}
              >
                {c.sentence_parts[c.key_index]}
              </p>
              <p className="text-xs text-muted mt-0.5">{c.translation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function VocabDetailPage() {
  const { setId } = useParams<{ setId: string }>();
  const router = useRouter();
  const { sets, loading: setsLoading } = useFlashcardSets();
  const { sessions, loading: sessionsLoading } = useFlashcardSessions(setId);
  const { cards, loading: cardsLoading } = useFlashcards(setId);
  const [showWordList, setShowWordList] = useState(false);

  if (setsLoading || sessionsLoading || cardsLoading) return (
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

  // "Mastered" (per-card known status) still gates the Review button, even
  // though it's no longer shown as a top-level stat — score history replaces
  // it there.
  const mastered = set.mastery_count ?? 0;
  const total = set.card_count;

  const highest = sessions.reduce<typeof sessions[number] | null>(
    (best, s) => (!best || s.score > best.score ? s : best),
    null
  );
  const masteryPct = highest ? Math.round((highest.score / highest.total) * 100) : 0;
  const last5 = sessions.slice(0, 5);

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      {showWordList && <WordListModal cards={cards} onClose={() => setShowWordList(false)} />}

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => router.push('/cards')} className="text-2xl text-muted hover:text-ink transition-colors">←</button>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
          style={{ backgroundColor: categoryColor(set.category) }}>
          {set.icon}
        </div>
        <h1 className="font-quicksand font-bold text-ink text-xl flex-1">{set.title}</h1>
        <button
          onClick={() => setShowWordList(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cream border border-border hover:border-ink transition-colors flex-shrink-0"
        >
          <span className="text-sm">📖</span>
          <span className="text-xs font-bold text-ink">Preview words</span>
        </button>
      </div>

      {/* Stats card */}
      <div className="bg-white rounded-2xl p-5 mb-4" style={{ boxShadow: '0 3px 14px rgba(26,31,54,0.07)' }}>
        <div className="flex justify-between mb-4">
          <div>
            <p className="font-quicksand font-bold text-ink text-xl">{total}</p>
            <p className="text-xs text-muted">Total cards</p>
          </div>
          <div>
            <p className="font-quicksand font-bold text-xl" style={{ color: '#1E8E3E' }}>
              {highest ? `${highest.score}/${highest.total}` : '—'}
            </p>
            <p className="text-xs text-muted">Highest score</p>
          </div>
          <div>
            <p className="font-quicksand font-bold text-ink text-xl">
              {highest ? formatDate(highest.completed_at) : '—'}
            </p>
            <p className="text-xs text-muted">Achieved</p>
          </div>
        </div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-muted">Mastery</span>
          <span className="text-xs font-bold" style={{ color: '#1E8E3E' }}>{masteryPct}%</span>
        </div>
        <ProgressBar progress={masteryPct / 100} color="#34A853" height={8} />
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

      {/* Last 5 attempts */}
      <p className="text-[11px] font-bold text-muted tracking-widest mb-3">LAST 5 ATTEMPTS</p>
      {last5.length === 0 ? (
        <div className="bg-white rounded-xl border border-border px-4 py-5 text-center">
          <p className="text-sm text-muted">
            No attempts yet — start a session to track your progress here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {last5.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl border border-border px-4 py-3 flex items-center justify-between"
            >
              <p className="font-quicksand font-bold text-ink">
                {s.score}/{s.total}
              </p>
              <p className="text-xs text-muted">{formatDate(s.completed_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
