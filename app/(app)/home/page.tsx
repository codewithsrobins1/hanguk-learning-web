'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useUserStats } from '@/hooks/useUserStats';
import { useRandomCard, useFlashcardSets } from '@/hooks/useFlashcards';
import { usePassages } from '@/hooks/usePassages';
import ProgressBar from '@/components/ProgressBar';
import { useChangelog } from '@/hooks/useChangelog';
import FlipCard from '@/components/FlipCard';

const XP_SOURCES = [
  { icon: '⧉', label: 'Flashcard set complete', xp: '+10 XP' },
  {
    icon: '⧉',
    label: 'Flashcard set — perfect score',
    xp: '+15 XP',
    perfect: true,
  },
  { icon: '가', label: 'Hangul session done', xp: '+10 XP' },
  { icon: '💬', label: 'Shadowing dialogue done', xp: '+10 XP' },
  { icon: '≡', label: 'Reading passage + quiz done', xp: '+10 XP' },
  {
    icon: '≡',
    label: 'Reading passage — perfect quiz',
    xp: '+15 XP',
    perfect: true,
  },
];

export default function HomePage() {
  const { profile } = useAuth();
  const { stats } = useUserStats();
  const randomCard = useRandomCard();
  const { sets } = useFlashcardSets();
  const { passages } = usePassages();
  const [cardFlipped, setCardFlipped] = useState(false);
  const [showXpModal, setShowXpModal] = useState(false);
  const { entries } = useChangelog();

  const displayName = profile?.display_name || profile?.username || 'Learner';
  const recentSet = sets.find((s) => (s.mastery_count ?? 0) > 0) ?? sets[0];
  const recentPassage = passages.find((p) => p.done) ?? passages[0];

  return (
    <div className="max-w-xl mx-auto px-7 py-8">
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs text-muted font-medium mb-1">안녕!</p>
          <h1 className="text-3xl font-extrabold text-ink">{displayName}</h1>
        </div>
        {/* Level badge */}
        <div className="bg-navy rounded-2xl px-4 py-2.5 text-center min-w-[64px]">
          <p
            className="text-[11px] tracking-widest mb-0.5"
            style={{ color: '#888' }}
          >
            LEVEL
          </p>
          <p className="text-cream font-extrabold text-2xl leading-none">
            {stats.level}
          </p>
        </div>
      </div>

      {/* ── XP Bar ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border p-4 mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base">⚡</span>
            <span className="text-sm font-bold text-ink">
              Level {stats.level}
            </span>
            <span className="text-[11px] text-muted">
              → Level {stats.level + 1}
            </span>
          </div>
          <span className="text-[11px] text-muted">
            {stats.xpIntoLevel} / {stats.xpNeeded} XP
          </span>
        </div>
        <div
          className="rounded-full overflow-hidden mb-2"
          style={{ background: '#F7F4EE', height: 10 }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.round(stats.xpProgress * 100)}%`,
              background: '#1A1F36',
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted">
            {stats.xpNeeded - stats.xpIntoLevel} XP to level up
          </p>
          <button
            onClick={() => setShowXpModal(true)}
            className="flex items-center gap-1 text-[11px] text-muted hover:text-ink transition-colors"
          >
            How XP is earned
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-muted text-[9px]">
              ?
            </span>
          </button>
        </div>
      </div>

      {/* ── Overview ──────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border p-4 mb-8">
        <p className="text-[11px] font-bold text-muted tracking-widest mb-3">
          OVERVIEW
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-cream rounded-xl p-3">
            <p className="text-[10px] font-bold text-muted tracking-wider mb-1">
              VOCAB
            </p>
            <p className="text-xl font-extrabold text-ink mb-0.5">
              {stats.cardsKnown}
              <span className="text-xs font-semibold text-muted">
                {' '}
                / {stats.totalCards}
              </span>
            </p>
            <p className="text-[10px] text-muted mb-2">cards known</p>
            <ProgressBar
              progress={
                stats.totalCards > 0 ? stats.cardsKnown / stats.totalCards : 0
              }
              color="#E8412C"
            />
          </div>
          <div className="bg-cream rounded-xl p-3">
            <p className="text-[10px] font-bold text-muted tracking-wider mb-1">
              READING
            </p>
            <p className="text-xl font-extrabold text-ink mb-0.5">
              {stats.passagesDone}
              <span className="text-xs font-semibold text-muted">
                {' '}
                / {stats.totalPassages}
              </span>
            </p>
            <p className="text-[10px] text-muted mb-2">passages done</p>
            <ProgressBar
              progress={
                stats.totalPassages > 0
                  ? stats.passagesDone / stats.totalPassages
                  : 0
              }
              color="#3B82F6"
            />
          </div>
        </div>
      </div>

      {/* ── Quick Practice ────────────────────────────────────── */}
      {randomCard && (
        <div className="mb-8">
          <p className="text-[14px] font-bold text-muted tracking-widest mb-2">
            Quick Practice
          </p>
          <FlipCard
            height={130}
            flipped={cardFlipped}
            onFlip={() => setCardFlipped(!cardFlipped)}
            front={
              <div className="h-full bg-navy rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer">
                <p className="text-[10px] text-gray-500 tracking-widest mb-3">
                  TAP TO REVEAL
                </p>
                <p
                  className="text-xl font-semibold text-cream text-center leading-relaxed"
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
              <div
                className="h-full bg-cream rounded-3xl flex flex-col items-center justify-center p-6 cursor-pointer"
                style={{ boxShadow: 'inset 0 0 0 2px #1A1F36' }}
              >
                <p className="text-[10px] text-muted tracking-widest mb-2">
                  TRANSLATION
                </p>
                <p className="text-lg font-bold text-ink text-center">
                  {randomCard.translation}
                </p>
              </div>
            }
          />
        </div>
      )}

      {/* ── Continue where you left off ──────────────────────── */}
      {(recentSet || recentPassage) && (
        <div className="mb-8">
          <p className="text-[14px] font-bold text-muted tracking-widest mb-2">
            Continue where you left off
          </p>
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
                  <p className="font-extrabold text-sm text-ink truncate">
                    {recentSet.title}
                  </p>
                  <p className="text-[11px] text-muted mb-1.5">
                    Flashcards · {recentSet.mastery_count ?? 0} /{' '}
                    {recentSet.card_count} known
                  </p>
                  <ProgressBar
                    progress={
                      recentSet.card_count > 0
                        ? (recentSet.mastery_count ?? 0) / recentSet.card_count
                        : 0
                    }
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
                  <p className="font-extrabold text-sm text-ink truncate">
                    {recentPassage.title_en}
                  </p>
                  <p className="text-[11px] text-muted mb-1.5">
                    Reading ·{' '}
                    {recentPassage.done ? 'Quiz completed' : 'Quiz not taken'}
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

      {/* ── Latest Updates ────────────────────────────────────── */}
      {entries.length > 0 && (
        <div className="mb-3">
          <p className="text-[14px] font-bold text-muted tracking-widest mb-2">
            LATEST UPDATES
          </p>
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            {entries.map((entry, i) => (
              <div
                key={entry.id}
                className={`flex items-start gap-3 px-4 py-3.5 ${i < entries.length - 1 ? 'border-b border-border' : ''}`}
              >
                <div className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                  {entry.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-sm font-extrabold text-ink">
                      {entry.section}
                    </p>
                    <p className="text-[10px] font-semibold text-muted flex-shrink-0">
                      {new Date(entry.date + 'T00:00:00').toLocaleDateString(
                        'en-US',
                        { month: 'short', day: 'numeric' }
                      )}
                    </p>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    {entry.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── XP Modal ─────────────────────────────────────────── */}
      {showXpModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={() => setShowXpModal(false)}
        >
          <div
            className="bg-white w-full max-w-[500px] rounded-3xl p-6 pb-8 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <p className="text-base font-extrabold text-ink">
                How XP is earned
              </p>
              <button
                onClick={() => setShowXpModal(false)}
                className="w-7 h-7 rounded-full bg-cream flex items-center justify-center text-muted hover:text-ink text-sm"
              >
                ✕
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border">
              {XP_SOURCES.map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-4 py-3 ${i < XP_SOURCES.length - 1 ? 'border-b border-border' : ''} ${i % 2 === 0 ? 'bg-white' : 'bg-cream'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base w-5 text-center">{s.icon}</span>
                    <span className="text-sm text-ink">{s.label}</span>
                    {s.perfect && (
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                        style={{ background: '#FDE8E4', color: '#E8412C' }}
                      >
                        perfect
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-lg bg-navy text-cream">
                    {s.xp}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted text-center mt-4">
              XP never resets — progress always counts
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
