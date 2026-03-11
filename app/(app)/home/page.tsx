'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useUserStats } from '@/hooks/useUserStats';
import { useRandomCard, useFlashcardSets } from '@/hooks/useFlashcards';
import { usePassages } from '@/hooks/usePassages';
import ProgressBar from '@/components/ProgressBar';
import FlipCard from '@/components/FlipCard';

// Generate last N days for the streak carousel
function buildCalendar(streak: number, n = 30) {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (n - 1 - i));
    return {
      date: d.getDate(),
      day: d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
      active: i >= n - streak,
      isToday: i === n - 1,
    };
  });
}

export default function HomePage() {
  const { profile } = useAuth();
  const { stats } = useUserStats();
  const randomCard = useRandomCard();
  const { sets } = useFlashcardSets();
  const { passages } = usePassages();
  const [cardFlipped, setCardFlipped] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const displayName = profile?.display_name || profile?.username || 'Learner';
  const calendarDays = buildCalendar(stats.streak);

  // Scroll carousel to end (today) on mount
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = carouselRef.current.scrollWidth;
    }
  }, []);

  // "Continue where you left off" — pick most recent set and passage
  const recentSet = sets.find(s => (s.mastery_count ?? 0) > 0) ?? sets[0];
  const recentPassage = passages.find(p => p.done) ?? passages[0];

  return (
    <div className="max-w-xl mx-auto px-5 py-8">

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs text-muted font-medium mb-1">안녕!</p>
          <h1 className="text-3xl font-extrabold text-ink">{displayName}</h1>
        </div>
        {/* Streak badge */}
        <div className="bg-navy rounded-2xl px-4 py-2.5 text-center min-w-[60px]">
          <p className="text-xl leading-none mb-1">🔥</p>
          <p className="text-cream font-extrabold text-base leading-none">{stats.streak}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">day streak</p>
        </div>
      </div>

      {/* ── Activity carousel ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border mb-3 pt-4 pb-3 overflow-hidden">
        <div className="flex items-center justify-between px-4 mb-3">
          <p className="text-[11px] font-bold text-muted tracking-widest">ACTIVITY</p>
          <p className="text-[11px] font-bold text-red">{stats.streak} day streak 🔥</p>
        </div>
        {/* Scrollable row */}
        <div
          ref={carouselRef}
          className="flex gap-2 overflow-x-auto px-4 pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          {calendarDays.map((d, i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: 40, height: 40,
                  background: d.active ? '#E8412C' : '#F7F4EE',
                  border: `1.5px solid ${d.isToday ? '#111' : d.active ? '#E8412C' : '#E8E3D8'}`,
                  boxShadow: d.isToday ? '0 0 0 2px #111' : 'none',
                }}
              >
                {d.active
                  ? <span style={{ fontSize: 16 }}>🔥</span>
                  : <span className="text-[11px] font-bold text-muted">{d.date}</span>
                }
              </div>
              <p className="text-[9px] font-bold" style={{ color: d.active ? '#E8412C' : '#bbb' }}>{d.day}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Overview ──────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border p-4 mb-3">
        <p className="text-[11px] font-bold text-muted tracking-widest mb-3">OVERVIEW</p>
        <div className="grid grid-cols-2 gap-3">
          {/* Vocab */}
          <div className="bg-cream rounded-xl p-3">
            <p className="text-[10px] font-bold text-muted tracking-wider mb-1">VOCAB</p>
            <p className="text-xl font-extrabold text-ink mb-0.5">
              {stats.cardsKnown}
              <span className="text-xs font-semibold text-muted"> / {stats.totalCards}</span>
            </p>
            <p className="text-[10px] text-muted mb-2">cards known</p>
            <ProgressBar progress={stats.totalCards > 0 ? stats.cardsKnown / stats.totalCards : 0} color="#E8412C" />
          </div>
          {/* Reading */}
          <div className="bg-cream rounded-xl p-3">
            <p className="text-[10px] font-bold text-muted tracking-wider mb-1">READING</p>
            <p className="text-xl font-extrabold text-ink mb-0.5">
              {stats.passagesDone}
              <span className="text-xs font-semibold text-muted"> / {stats.totalPassages}</span>
            </p>
            <p className="text-[10px] text-muted mb-2">passages done</p>
            <ProgressBar progress={stats.totalPassages > 0 ? stats.passagesDone / stats.totalPassages : 0} color="#3B82F6" />
          </div>
        </div>
      </div>

      {/* ── Word of the Day ───────────────────────────────────── */}
      {randomCard && (
        <div className="mb-3">
          <p className="text-[11px] font-bold text-muted tracking-widest mb-2">WORD OF THE DAY</p>
          <FlipCard
            height={130}
            flipped={cardFlipped}
            onFlip={() => setCardFlipped(!cardFlipped)}
            front={
              <div className="h-full bg-navy rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer">
                <p className="text-[10px] text-gray-500 tracking-widest mb-3">TAP TO REVEAL</p>
                <p className="text-xl font-semibold text-cream text-center leading-relaxed" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                  {randomCard.sentence_parts.map((part, i) =>
                    i === randomCard.key_index
                      ? <span key={i} className="text-red font-extrabold">{part}</span>
                      : <span key={i}>{part}</span>
                  )}
                </p>
              </div>
            }
            back={
              <div className="h-full bg-cream rounded-2xl flex flex-col items-center justify-center p-6 border-[1.5px] border-border cursor-pointer">
                <p className="text-[10px] text-muted tracking-widest mb-2">TRANSLATION</p>
                <p className="text-lg font-bold text-ink text-center">{randomCard.translation}</p>
              </div>
            }
          />
        </div>
      )}

      {/* ── Continue where you left off ──────────────────────── */}
      {(recentSet || recentPassage) && (
        <div className="mb-3">
          <p className="text-sm font-extrabold text-ink mb-2">Continue where you left off</p>
          <div className="flex flex-col gap-2">
            {recentSet && (
              <Link
                href={`/cards/${recentSet.id}`}
                className="bg-white border border-border rounded-2xl px-4 py-3 flex items-center gap-3 hover:border-ink transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-cream flex items-center justify-center text-xl flex-shrink-0">
                  {recentSet.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-sm text-ink truncate">{recentSet.title}</p>
                  <p className="text-[11px] text-muted mb-1.5">
                    Flashcards · {recentSet.mastery_count ?? 0} / {recentSet.card_count} known
                  </p>
                  <ProgressBar
                    progress={recentSet.card_count > 0 ? (recentSet.mastery_count ?? 0) / recentSet.card_count : 0}
                    color="#E8412C"
                  />
                </div>
                <span className="text-muted text-base flex-shrink-0">→</span>
              </Link>
            )}
            {recentPassage && (
              <Link
                href={`/read/${recentPassage.id}`}
                className="bg-white border border-border rounded-2xl px-4 py-3 flex items-center gap-3 hover:border-ink transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-cream flex items-center justify-center text-xl flex-shrink-0">
                  📖
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-sm text-ink truncate">{recentPassage.title_en}</p>
                  <p className="text-[11px] text-muted mb-1.5">
                    Reading · {recentPassage.done ? 'Quiz completed' : 'Quiz not taken'}
                  </p>
                  <ProgressBar
                    progress={recentPassage.done ? 1 : 0.4}
                    color="#3B82F6"
                  />
                </div>
                <span className="text-muted text-base flex-shrink-0">→</span>
              </Link>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
