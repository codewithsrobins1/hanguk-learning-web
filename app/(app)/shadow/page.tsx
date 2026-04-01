'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useDialogues } from '@/hooks/useShadowing';
import { Dialogue } from '@/types';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const;

const DIFFICULTY_COLORS = {
  Beginner: { bg: '#F0FFF4', text: '#22C55E' },
  Intermediate: { bg: '#FFF7ED', text: '#F97316' },
  Advanced: { bg: '#FFF0EE', text: '#E8412C' },
};

function formatDate(date: Date | null): string {
  if (!date) return 'Not completed';
  return (
    'Last completed: ' +
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  );
}

export default function ShadowPage() {
  const { dialogues, loading } = useDialogues();
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState<string | null>(null);

  const categories = [
    'All',
    ...Array.from(new Set(dialogues.map((d) => d.category))),
  ];
  const hasFilters = difficulty !== null || category !== 'All';

  const filtered = dialogues.filter((d) => {
    const matchesDiff = difficulty === null || d.difficulty === difficulty;
    const matchesCat = category === 'All' || d.category === category;
    return matchesDiff && matchesCat;
  });

  const grouped = DIFFICULTIES.reduce<Record<string, typeof dialogues>>(
    (acc, diff) => {
      const items = filtered.filter((d) => d.difficulty === diff);
      if (items.length > 0) acc[diff] = items;
      return acc;
    },
    {}
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-extrabold text-ink mb-1">Shadowing</h1>
      <p className="text-sm text-muted mb-6">
        Practice real Korean conversations
      </p>

      {/* Filters row */}
      <div className="flex flex-wrap gap-6 mb-2">
        <div className="flex-1">
          <p className="text-[11px] font-bold text-muted tracking-widest mb-2">
            DIFFICULTY
          </p>
          <div className="flex gap-2 flex-wrap">
            {DIFFICULTIES.map((d) => {
              const isSelected = difficulty === d;
              const c = DIFFICULTY_COLORS[d];
              return (
                <button
                  key={d}
                  onClick={() => setDifficulty(isSelected ? null : d)}
                  className="px-5 py-2 rounded-full font-bold text-[15px] transition-all border-[1.5px] cursor-pointer"
                  style={{
                    background: isSelected ? c.text : '#fff',
                    color: isSelected ? '#fff' : c.text,
                    borderColor: c.text,
                  }}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
        <div className="w-full md:w-56 flex-shrink-0">
          <p className="text-[11px] font-bold text-muted tracking-widest mb-2">
            CATEGORY
          </p>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-[1.5px] border-border bg-white text-sm font-bold text-ink appearance-none outline-none cursor-pointer focus:border-ink transition-colors"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
              ▾
            </span>
          </div>
        </div>
      </div>

      {/* Clear filters */}
      <div className="h-9 flex items-center mb-4">
        {hasFilters && (
          <button
            onClick={() => {
              setDifficulty(null);
              setCategory('All');
            }}
            className="px-4 py-1.5 rounded-full border-[1.5px] border-border bg-white text-xs font-bold text-muted hover:border-ink hover:text-ink transition-colors"
          >
            ✕ Clear filters
          </button>
        )}
      </div>

      {/* Grouped cards */}
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center mt-16">
          <p className="text-muted text-sm">No dialogues match your filters.</p>
          <button
            onClick={() => {
              setDifficulty(null);
              setCategory('All');
            }}
            className="mt-4 text-xs font-bold text-red hover:opacity-75 transition-opacity"
          >
            Clear filters
          </button>
        </div>
      ) : (
        Object.entries(grouped).map(([diff, items]) => {
          const c = DIFFICULTY_COLORS[diff as keyof typeof DIFFICULTY_COLORS];
          return (
            <div key={diff} className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="text-s font-extrabold px-3 py-1 rounded-full"
                  style={{ background: c.bg, color: c.text }}
                >
                  {diff}
                </span>
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted font-semibold">
                  {items.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((d) => (
                  <Link
                    key={d.id}
                    href={`/shadow/${d.id}`}
                    className="bg-white border-[1.5px] border-border rounded-2xl px-5 py-4 flex items-center justify-between gap-3 hover:border-ink transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-[18px] text-ink mb-0.5">
                        {d.title}
                      </p>
                      <p
                        className="text-[16px] text-muted mb-1"
                        style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
                      >
                        {d.title_ko}
                      </p>
                      <p className="text-xs text-muted">{d.category}</p>
                      <p
                        className="text-[11px] font-semibold mt-1"
                        style={{
                          color: d.completed_at ? '#16A34A' : '#888888',
                        }}
                      >
                        {formatDate(d.completed_at)}
                      </p>
                    </div>
                    <span className="text-muted text-lg flex-shrink-0">→</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
