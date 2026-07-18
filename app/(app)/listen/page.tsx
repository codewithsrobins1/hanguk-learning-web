'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useListeningExercises } from '@/hooks/useListening';
import { staggerContainer, staggerItem } from '@/lib/motion-variants';

const CATEGORIES = ['All', 'Daily Life', 'Food', 'Counting & Numbers', 'Music', 'Study', 'Gaming', 'Family', 'Travel', 'Culture'];

const DIFFICULTY_COLORS = {
  Beginner:     { bg: '#F0FFF4', text: '#16A34A', border: '#86EFAC' },
  Intermediate: { bg: '#FFF7ED', text: '#F97316', border: '#FED7AA' },
  Advanced:     { bg: '#FFF0EE', text: '#E8412C', border: '#FCA5A5' },
};

function formatMonthYear(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function scoreColor(score: number, total: number) {
  const pct = score / total;
  if (pct === 1) return '#16A34A';
  if (pct >= 0.66) return '#F97316';
  return '#E8412C';
}

export default function ListenPage() {
  const { exercises, loading } = useListeningExercises();
  const [category, setCategory] = useState('All');
  const [hideCompleted, setHideCompleted] = useState(false);

  const filtered = exercises.filter(ex => {
    const matchesCat = category === 'All' || ex.category === category;
    return matchesCat && (!hideCompleted || !ex.completed_at);
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <h1 className="font-quicksand font-bold text-ink text-3xl mb-1">Listening</h1>
      <p className="text-sm text-muted mb-6">Listen to Korean conversations and answer questions</p>

      {/* Category dropdown */}
      <div className="mb-6">
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full sm:w-64 px-4 py-3 rounded-2xl border-2 border-border bg-white text-sm font-bold text-ink appearance-none outline-none focus:border-ink transition-colors cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 16px center',
            paddingRight: 40,
          }}
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
          ))}
        </select>
      </div>


      {/* Hide completed toggle */}
      <label className="flex items-center gap-2 cursor-pointer mb-5 w-fit">
        <div
          onClick={() => setHideCompleted(h => !h)}
          className="relative w-9 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0"
          style={{ background: hideCompleted ? '#1A1F36' : '#E8E3D8' }}
        >
          <div className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
            style={{ left: hideCompleted ? '18px' : '2px' }} />
        </div>
        <span className="text-sm font-semibold text-muted">Hide completed</span>
      </label>

      {/* Exercise grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-2">
          <p className="text-muted text-sm">No exercises in this category yet.</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {filtered.map(ex => {
            const dc = DIFFICULTY_COLORS[ex.difficulty];
            const done = ex.completed_at !== null;
            const perfect = done && ex.score === ex.total;
            return (
              <motion.div key={ex.id} variants={staggerItem}>
                <Link href={`/listen/${ex.id}`}
                  className="relative bg-white rounded-3xl px-5 py-4 flex items-center justify-between gap-3 hover:border-ink transition-colors"
                  style={{
                    boxShadow: '0 3px 14px rgba(26,31,54,0.07)',
                    border: '2px solid #E8E3D8',
                  }}>
                  {perfect && (
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full" style={{ background: '#34A853' }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                        style={{ background: dc.bg, color: dc.text, border: `1px solid ${dc.border}` }}>
                        {ex.difficulty}
                      </span>
                      <span className="text-[11px] text-muted font-medium">{ex.category}</span>
                    </div>
                    <p className="font-quicksand font-bold text-ink text-base truncate">{ex.title}</p>
                    <p className="text-xs text-muted mb-1.5" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{ex.title_ko}</p>
                    {done && ex.score !== null && ex.total !== null ? (
                      <p className="text-[11px] font-bold" style={{ color: scoreColor(ex.score, ex.total) }}>
                        {ex.score}/{ex.total} correct · {formatMonthYear(ex.completed_at!)}
                      </p>
                    ) : (
                      <p className="text-[11px] font-semibold" style={{ color: '#D97B6C' }}>Not completed</p>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <span className="text-2xl">🎧</span>
                    {done && (
                      <div className="w-2 h-2 rounded-full" style={{ background: scoreColor(ex.score!, ex.total!) }} />
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
