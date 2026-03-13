'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useFlashcardSets } from '@/hooks/useFlashcards';
import ProgressBar from '@/components/ProgressBar';

const iconColors: Record<string, string> = {
  Verbs: '#FDE8E4',  Nouns: '#EFF6FF',
  Food: '#FFF7ED',   Music: '#F5F3FF',  Travel: '#FFF0EE',
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

export default function CardsPage() {
  const { sets, loading } = useFlashcardSets();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(sets.map(s => s.category)))];

  const filtered = sets.filter(s => {
    const matchesCategory = category === 'All' || s.category === category;
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-extrabold text-ink mb-5">Flashcards</h1>

      {/* Search + Filter row */}
      <div className="flex gap-2 mb-5">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search sets..."
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
          <p className="text-muted text-sm font-medium">No sets match your search</p>
          <button onClick={() => { setSearch(''); setCategory('All'); }} className="text-xs font-bold text-ink underline mt-1">Clear filters</button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(set => (
            <Link
              key={set.id}
              href={`/cards/${set.id}`}
              className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-border hover:border-ink transition-colors group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ backgroundColor: iconColors[set.category] || '#E8E3D8' }}
              >
                {set.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-ink text-sm mb-1">{set.title}</p>
                <p className="text-[11px] font-semibold text-red mb-2">
                  {set.mastery_count || 0} / {set.card_count} MASTERY
                </p>
                <ProgressBar
                  progress={set.card_count > 0 ? (set.mastery_count || 0) / set.card_count : 0}
                  color="#E8412C"
                />
              </div>
              <span className="text-xl text-muted group-hover:text-ink transition-colors">›</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
