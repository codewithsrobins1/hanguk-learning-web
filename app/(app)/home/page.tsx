'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useUserStats } from '@/hooks/useUserStats';
import { useRandomCard } from '@/hooks/useFlashcards';
import ProgressBar from '@/components/ProgressBar';
import FlipCard from '@/components/FlipCard';

const categoryColors: Record<string, string> = {
  'Daily Life': 'text-blue-500',
  Food: 'text-orange-500',
  Music: 'text-purple-500',
  Travel: 'text-red',
};

export default function HomePage() {
  const { profile } = useAuth();
  const { stats } = useUserStats();
  const randomCard = useRandomCard();
  const [cardFlipped, setCardFlipped] = useState(false);

  const displayName = profile?.display_name || profile?.username || 'Learner';

  const overview = [
    {
      label: 'HANGUL',
      value: `${Math.round((stats.hangulKnown / 40) * 100)}%`,
      progress: stats.hangulKnown / 40,
      color: '#22C55E',
    },
    {
      label: 'VOCAB',
      value: `${stats.cardsKnown}`,
      progress: stats.totalCards > 0 ? stats.cardsKnown / stats.totalCards : 0,
      color: '#E8412C',
    },
    {
      label: 'READING',
      value: `Level ${Math.min(Math.floor(stats.passagesDone / 2) + 1, 5)}`,
      progress:
        stats.totalPassages > 0 ? stats.passagesDone / stats.totalPassages : 0,
      color: '#3B82F6',
    },
  ];

  const jumpLinks = [
    { label: 'Learn Hangul', icon: '가', href: '/hangul' },
    { label: 'Flashcards', icon: '⧉', href: '/cards' },
    { label: 'Reading', icon: '≡', href: '/read' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs text-muted font-medium mb-1">안녕!</p>
          <h1 className="text-3xl font-extrabold text-ink">{displayName}</h1>
        </div>
        <div className="flex items-center gap-1.5 bg-ink text-cream rounded-full px-4 py-2">
          <span>🔥</span>
          <span className="font-bold text-sm">{stats.streak}</span>
        </div>
      </div>

      {/* Overview */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-border mb-5">
        <p className="text-[11px] font-bold text-muted tracking-widest mb-4">
          OVERVIEW
        </p>
        <div className="grid grid-cols-3 gap-3">
          {overview.map((item) => (
            <div key={item.label} className="bg-cream rounded-xl p-3">
              <p className="text-[9px] font-bold text-muted tracking-wider mb-1">
                {item.label}
              </p>
              <p className="text-lg font-extrabold text-ink mb-2">
                {item.value}
              </p>
              <ProgressBar progress={item.progress} color={item.color} />
            </div>
          ))}
        </div>
      </div>

      {/* Word of the Day */}
      {randomCard && (
        <div className="mb-5">
          <p className="text-[11px] font-bold text-muted tracking-widest mb-3">
            WORD OF THE DAY
          </p>
          <FlipCard
            height={140}
            flipped={cardFlipped}
            onFlip={() => setCardFlipped(!cardFlipped)}
            front={
              <div className="h-full bg-navy rounded-3xl flex flex-col items-center justify-center p-6 cursor-pointer">
                <p className="text-[11px] text-gray-500 tracking-widest mb-3">
                  TAP TO REVEAL
                </p>
                <p
                  className="text-2xl font-semibold text-cream text-center leading-relaxed"
                  style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
                >
                  {randomCard.sentence_parts.map((part, i) =>
                    i === randomCard.key_index ? (
                      <span key={i} className="text-red font-extrabold">
                        {part}
                      </span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </p>
              </div>
            }
            back={
              <div className="h-full bg-cream rounded-3xl flex flex-col items-center justify-center p-6 border-2 border-border cursor-pointer">
                <p className="text-[11px] text-muted tracking-widest mb-2">
                  TRANSLATION
                </p>
                <p className="text-xl font-bold text-ink text-center">
                  {randomCard.translation}
                </p>
              </div>
            }
          />
        </div>
      )}

      {/* Jump back in */}
      <div className="mb-5">
        <p className="text-base font-bold text-ink mb-3">Jump back in</p>
        <div className="grid grid-cols-3 gap-3">
          {jumpLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm border border-border hover:border-ink transition-colors"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-semibold text-inkLight text-center">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
