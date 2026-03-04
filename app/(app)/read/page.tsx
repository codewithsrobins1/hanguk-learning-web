'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePassages } from '@/hooks/usePassages';
import Pill from '@/components/Pill';

const catColors: Record<string, { bg: string; text: string }> = {
  'Daily Life': { bg: '#EFF6FF', text: '#3B82F6' },
  Food: { bg: '#FFF7ED', text: '#F97316' },
  Music: { bg: '#F5F3FF', text: '#8B5CF6' },
  Travel: { bg: '#FFF0EE', text: '#E8412C' },
};

export default function ReadPage() {
  const { passages, loading } = usePassages();
  const [filter, setFilter] = useState('All');

  const categories = [
    'All',
    ...Array.from(new Set(passages.map((p) => p.category))),
  ];
  const filtered =
    filter === 'All' ? passages : passages.filter((p) => p.category === filter);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-extrabold text-ink mb-5">
        Reading Practice
      </h1>

      <div className="flex gap-2 flex-wrap mb-5">
        {categories.map((c) => (
          <Pill key={c} active={filter === c} onClick={() => setFilter(c)}>
            {c}
          </Pill>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((p) => {
            const cat = catColors[p.category] || {
              bg: '#E8E3D8',
              text: '#888',
            };
            return (
              <Link
                key={p.id}
                href={`/read/${p.id}`}
                className="bg-white rounded-2xl p-4 shadow-sm border border-border hover:border-ink transition-colors group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p
                      className="text-xl font-extrabold text-ink mb-0.5"
                      style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
                    >
                      {p.title}
                    </p>
                    <p className="text-xs text-muted">{p.title_en}</p>
                  </div>
                  {p.done && (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg border-[1.5px] border-green bg-greenLight">
                      <span className="text-xs text-green">✓</span>
                      <span className="text-xs font-bold text-green">
                        {p.score}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md"
                    style={{ backgroundColor: cat.bg, color: cat.text }}
                  >
                    {p.category}
                  </span>
                  <span className="text-xs text-muted">· {p.read_time}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
