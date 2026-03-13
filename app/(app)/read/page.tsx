'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePassages } from '@/hooks/usePassages';

const catColors: Record<string, { bg: string; text: string }> = {
  'Daily Life': { bg: '#EFF6FF', text: '#3B82F6' },
  Food:         { bg: '#FFF7ED', text: '#F97316' },
  Music:        { bg: '#F5F3FF', text: '#8B5CF6' },
  Travel:       { bg: '#FFF0EE', text: '#E8412C' },
  Study:        { bg: '#F0FDF4', text: '#16A34A' },
  Culture:      { bg: '#FFF7ED', text: '#D97706' },
};

const selectStyle = {
  backgroundColor: '#fff',
  border: '1.5px solid #E8E3D8',
  borderRadius: 12,
  padding: '0 12px',
  height: 40,
  fontSize: 13,
  fontWeight: 600,
  color: '#111',
  outline: 'none',
  cursor: 'pointer',
  appearance: 'none' as const,
  WebkitAppearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  paddingRight: 30,
};

export default function ReadPage() {
  const { passages, loading } = usePassages();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(passages.map(p => p.category)))];

  const filtered = passages.filter(p => {
    const matchesCategory = category === 'All' || p.category === category;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.title_en.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-extrabold text-ink mb-5">Reading</h1>

      {/* Search + Filter row */}
      <div className="flex gap-2 mb-5">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search passages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-8 pr-3 rounded-xl border border-border bg-white text-sm font-medium text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors"
          />
        </div>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={selectStyle}
        >
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-2">
          <p className="text-2xl">🔍</p>
          <p className="text-muted text-sm font-medium">No passages match your search</p>
          <button onClick={() => { setSearch(''); setCategory('All'); }} className="text-xs font-bold text-ink underline mt-1">Clear filters</button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(p => {
            const cat = catColors[p.category] || { bg: '#E8E3D8', text: '#888' };
            return (
              <Link
                key={p.id}
                href={`/read/${p.id}`}
                className="bg-white rounded-2xl p-4 shadow-sm border border-border hover:border-ink transition-colors group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xl font-extrabold text-ink mb-0.5" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{p.title}</p>
                    <p className="text-xs text-muted">{p.title_en}</p>
                  </div>
                  {p.done && (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg border-[1.5px] border-green bg-greenLight">
                      <span className="text-xs text-green">✓</span>
                      <span className="text-xs font-bold text-green">{p.score}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md" style={{ backgroundColor: cat.bg, color: cat.text }}>
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
