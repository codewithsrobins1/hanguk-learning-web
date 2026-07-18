'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useDialogues } from '@/hooks/useShadowing';
import { staggerContainer, staggerItem } from '@/lib/motion-variants';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const;

const DIFFICULTY_COLORS = {
  Beginner:     { bg: '#F0FFF4', text: '#22C55E' },
  Intermediate: { bg: '#FFF7ED', text: '#F97316' },
  Advanced:     { bg: '#FFF0EE', text: '#E8412C' },
};

function scoreColor(score: number) {
  if (score >= 86) return '#16A34A';
  if (score >= 61) return '#F97316';
  return '#E8412C';
}

function formatMonthYear(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function ShadowPage() {
  const { dialogues, loading } = useDialogues();
  const [category,   setCategory]   = useState('All');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [difficulty, setDifficulty] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(dialogues.map(d => d.category)))];
  const hasFilters = difficulty !== null || category !== 'All';

  const filtered = dialogues.filter(d => {
    const matchesDiff = difficulty === null || d.difficulty === difficulty;
    const matchesCat  = category === 'All' || d.category === category;
    return matchesDiff && matchesCat && (!hideCompleted || !d.completed_at);
  });

  const grouped = DIFFICULTIES.reduce<Record<string, typeof dialogues>>((acc, diff) => {
    const items = filtered.filter(d => d.difficulty === diff);
    if (items.length > 0) acc[diff] = items;
    return acc;
  }, {});

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <h1 className="font-quicksand font-bold text-ink text-3xl mb-1">Shadowing</h1>
      <p className="text-sm text-muted mb-6">Practice real Korean conversations</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-6 mb-2">
        <div className="flex-1">
          <p className="text-[11px] font-bold text-muted tracking-widest mb-2">DIFFICULTY</p>
          <div className="flex gap-2 flex-wrap">
            {DIFFICULTIES.map(d => {
              const isSelected = difficulty === d;
              const c = DIFFICULTY_COLORS[d];
              return (
                <button key={d} onClick={() => setDifficulty(isSelected ? null : d)}
                  className="px-5 py-2 rounded-full font-bold text-[15px] transition-all border-[1.5px] cursor-pointer"
                  style={{ background: isSelected ? c.text : '#fff', color: isSelected ? '#fff' : c.text, borderColor: c.text }}>
                  {d}
                </button>
              );
            })}
          </div>
        </div>
        <div className="w-full md:w-56 flex-shrink-0">
          <p className="text-[11px] font-bold text-muted tracking-widest mb-2">CATEGORY</p>
          <div className="relative">
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-[1.5px] border-border bg-white text-sm font-bold text-ink appearance-none outline-none cursor-pointer focus:border-ink transition-colors">
              {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">▾</span>
          </div>
        </div>
      </div>

      <div className="h-9 flex items-center mb-4">
        {hasFilters && (
          <button onClick={() => { setDifficulty(null); setCategory('All'); }}
            className="px-4 py-1.5 rounded-full border-[1.5px] border-border bg-white text-xs font-bold text-muted hover:border-ink hover:text-ink transition-colors">
            ✕ Clear filters
          </button>
        )}
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

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center mt-16">
          <p className="text-muted text-sm">No dialogues match your filters.</p>
          <button onClick={() => { setDifficulty(null); setCategory('All'); }}
            className="mt-4 text-xs font-bold text-orange hover:opacity-75 transition-opacity">
            Clear filters
          </button>
        </div>
      ) : (
        Object.entries(grouped).map(([diff, items]) => {
          const c = DIFFICULTY_COLORS[diff as keyof typeof DIFFICULTY_COLORS];
          return (
            <div key={diff} className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-s font-extrabold px-3 py-1 rounded-full" style={{ background: c.bg, color: c.text }}>{diff}</span>
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted font-semibold">{items.length}</span>
              </div>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {items.map(d => (
                  <motion.div key={d.id} variants={staggerItem}>
                    <Link href={`/shadow/${d.id}`}
                      className="bg-white border-[1.5px] border-border rounded-3xl px-5 py-4 flex items-center justify-between gap-3 hover:border-ink transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-[18px] text-ink mb-0.5">{d.title}</p>
                        <p className="text-[16px] text-muted mb-1" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{d.title_ko}</p>
                        <p className="text-xs text-muted mb-1">{d.category}</p>
                        {d.completed_at ? (
                          <div className="flex items-center gap-2">
                            {d.best_score != null && (
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                                style={{ background: `${scoreColor(d.best_score)}18`, color: scoreColor(d.best_score) }}>
                                Best: {d.best_score}%
                              </span>
                            )}
                            <span className="text-[11px] text-muted">{formatMonthYear(d.completed_at)}</span>
                          </div>
                        ) : (
                          <p className="text-[11px] font-semibold" style={{ color: '#D97B6C' }}>Not completed</p>
                        )}
                      </div>
                      <span className="text-muted text-lg flex-shrink-0">→</span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          );
        })
      )}
    </div>
  );
}
