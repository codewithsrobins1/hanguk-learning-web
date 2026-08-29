'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useFlashcardSets, useFavoriteSets } from '@/hooks/useFlashcards';
import ProgressBar from '@/components/ProgressBar';
import { staggerContainer, staggerItem } from '@/lib/motion-variants';
import { categoryColor } from '@/lib/category-colors';
import { FlashcardSet } from '@/types';

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

const sectionLabelStyle = { letterSpacing: '0.07em' };

function FavoriteStar({ favorited, onClick }: { favorited: boolean; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button onClick={onClick} aria-label={favorited ? 'Unfavorite' : 'Favorite'} className="shrink-0 p-0.5">
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path
          d="M12 2l2.9 6.5L22 9.3l-5 4.9 1.2 7.1L12 17.8l-6.2 3.5L7 14.2 2 9.3l7.1-.8L12 2z"
          fill={favorited ? '#F97316' : '#FFFFFF'}
          stroke={favorited ? '#F97316' : '#C4BFBA'}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function SetCard({
  set,
  favorited,
  onToggleFavorite,
}: {
  set: FlashcardSet;
  favorited: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}) {
  const isComplete = (set.mastery_count ?? 0) >= set.card_count && set.card_count > 0;
  const progress = set.card_count > 0 ? (set.mastery_count || 0) / set.card_count : 0;

  return (
    <>
      {/* Compact card — mobile & tablet */}
      <Link
        href={`/cards/${set.id}`}
        className="lg:hidden relative bg-white rounded-2xl p-3.5 flex flex-col gap-2.5 hover:border-ink transition-colors"
        style={{ boxShadow: '0 3px 14px rgba(26,31,54,0.07)', border: '1px solid #E8E3D8' }}
      >
        {isComplete && (
          <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full" style={{ background: '#34A853' }} />
        )}
        <div className="flex items-start justify-between">
          <div
            className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center text-lg shrink-0"
            style={{ backgroundColor: categoryColor(set.category) }}
          >
            {set.icon}
          </div>
          <FavoriteStar favorited={favorited} onClick={onToggleFavorite} />
        </div>
        <div>
          <p className="font-quicksand font-bold text-ink text-[12.5px] mb-1 leading-tight">{set.title}</p>
          <p className="text-[9.5px] font-extrabold text-orange mb-1.5" style={sectionLabelStyle}>
            {set.mastery_count || 0} / {set.card_count} MASTERED
          </p>
          <ProgressBar progress={progress} color="#F97316" />
        </div>
      </Link>

      {/* Horizontal card — desktop */}
      <Link
        href={`/cards/${set.id}`}
        className="hidden lg:flex relative bg-white rounded-2xl p-4 items-center gap-4 hover:border-ink transition-colors group"
        style={{ boxShadow: '0 3px 14px rgba(26,31,54,0.07)', border: '1px solid #E8E3D8' }}
      >
        {isComplete && (
          <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full" style={{ background: '#34A853' }} />
        )}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ backgroundColor: categoryColor(set.category) }}
        >
          {set.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-ink text-sm mb-1">{set.title}</p>
          <p className="text-[11px] font-semibold text-orange mb-2">
            {set.mastery_count || 0} / {set.card_count} MASTERED
          </p>
          <ProgressBar progress={progress} color="#F97316" />
        </div>
        <FavoriteStar favorited={favorited} onClick={onToggleFavorite} />
        <span className="text-xl text-muted group-hover:text-ink transition-colors">›</span>
      </Link>
    </>
  );
}

export default function VocabPage() {
  const { sets, loading } = useFlashcardSets();
  const { favoriteIds, toggleFavorite } = useFavoriteSets();
  const [search,         setSearch]         = useState('');
  const [hideCompleted,  setHideCompleted]  = useState(false);
  const [category,       setCategory]       = useState('All');

  const categories = ['All', ...Array.from(new Set(sets.map(s => s.category)))];

  const filtered = sets.filter(s => {
    const matchesCategory = category === 'All' || s.category === category;
    const matchesSearch   = s.title.toLowerCase().includes(search.toLowerCase());
    const isComplete      = (s.mastery_count ?? 0) >= s.card_count && s.card_count > 0;
    return matchesCategory && matchesSearch && (!hideCompleted || !isComplete);
  });

  const sections = useMemo(() => {
    const favorites = filtered.filter(s => favoriteIds.has(s.id));
    const byCategory = new Map<string, FlashcardSet[]>();
    filtered.forEach(s => {
      if (!byCategory.has(s.category)) byCategory.set(s.category, []);
      byCategory.get(s.category)!.push(s);
    });
    const categorySections = Array.from(byCategory.entries()).map(([label, items]) => ({ label, items }));
    return favorites.length > 0
      ? [{ label: '⭐ Favorites', items: favorites }, ...categorySections]
      : categorySections;
  }, [filtered, favoriteIds]);

  const handleToggleFavorite = (e: React.MouseEvent, setId: string, isFavorited: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(setId, isFavorited);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <h1 className="font-quicksand font-bold text-ink text-3xl mb-5">Vocab</h1>

      {/* Search + Filter */}
      <div className="flex gap-2 mb-5">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">🔍</span>
          <input type="text" placeholder="Search sets..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-11 pl-9 pr-3 rounded-2xl border-2 border-border bg-white text-sm font-medium text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors"
          />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} style={selectStyle}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Hide completed toggle */}
      <label className="flex items-center gap-2 cursor-pointer mb-6 w-fit">
        <div onClick={() => setHideCompleted(h => !h)}
          className="relative w-9 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0"
          style={{ background: hideCompleted ? '#1A1F36' : '#E8E3D8' }}>
          <div className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
            style={{ left: hideCompleted ? '18px' : '2px' }} />
        </div>
        <span className="text-sm font-semibold text-muted">Hide completed</span>
      </label>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-2">
          <p className="text-2xl">🔍</p>
          <p className="text-muted text-sm font-medium">No sets match your search</p>
          <button onClick={() => { setSearch(''); setCategory('All'); }}
            className="text-xs font-bold text-ink underline mt-1">Clear filters</button>
        </div>
      ) : (
        sections.map(section => (
          <div key={section.label} className="mb-7">
            <p
              className="text-[13px] lg:text-[14px] font-extrabold uppercase text-muted underline mb-2.5"
              style={sectionLabelStyle}
            >
              {section.label}
            </p>
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-3 gap-3"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {section.items.map(set => (
                <motion.div key={set.id} variants={staggerItem}>
                  <SetCard
                    set={set}
                    favorited={favoriteIds.has(set.id)}
                    onToggleFavorite={(e) => handleToggleFavorite(e, set.id, favoriteIds.has(set.id))}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))
      )}
    </div>
  );
}
