'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useFlashcardSets } from '@/hooks/useFlashcards';
import Pill from '@/components/Pill';
import ProgressBar from '@/components/ProgressBar';

const iconColors: Record<string, string> = {
  Verbs: '#FDE8E4',
  Nouns: '#EFF6FF',
  Food: '#FFF7ED',
  Music: '#F5F3FF',
  Travel: '#FFF0EE',
};

export default function CardsPage() {
  const { sets, loading } = useFlashcardSets();
  const [filter, setFilter] = useState('All Sets');

  const categories = [
    'All Sets',
    ...Array.from(new Set(sets.map((s) => s.category))),
  ];
  const filtered =
    filter === 'All Sets' ? sets : sets.filter((s) => s.category === filter);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-extrabold text-ink mb-5">Flashcards</h1>

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
          {filtered.map((set) => (
            <Link
              key={set.id}
              href={`/cards/${set.id}`}
              className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-border hover:border-ink transition-colors group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{
                  backgroundColor: iconColors[set.category] || '#E8E3D8',
                }}
              >
                {set.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-ink text-sm mb-1">{set.title}</p>
                <p className="text-[11px] font-semibold text-red mb-2">
                  {set.mastery_count || 0} / {set.card_count} MASTERY
                </p>
                <ProgressBar
                  progress={
                    set.card_count > 0
                      ? (set.mastery_count || 0) / set.card_count
                      : 0
                  }
                  color="#E8412C"
                />
              </div>
              <span className="text-xl text-muted group-hover:text-ink transition-colors">
                ›
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
