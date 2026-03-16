'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { hangulVowels, hangulConsonants } from '@/data/hangul';
import FlipCard from '@/components/FlipCard';
import ProgressBar from '@/components/ProgressBar';
import { playCorrect, playIncorrect } from '@/lib/sounds';

type Mode = 'vowels' | 'consonants' | 'all';

export default function HangulSessionPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const cards =
    mode === 'vowels'
      ? hangulVowels
      : mode === 'consonants'
        ? hangulConsonants
        : mode === 'all'
          ? [...hangulVowels, ...hangulConsonants]
          : [];

  const handleAnswer = (isKnown: boolean) => {
    if (isKnown) {
      if (soundEnabled) playCorrect();
      setKnown((k) => [...k, index]);
    } else {
      if (soundEnabled) playIncorrect();
    }

    if (index + 1 >= cards.length) {
      setDone(true);
      return;
    }
    setFlipped(false);
    setTimeout(() => setIndex((i) => i + 1), 500);
  };

  const reset = (newMode?: Mode) => {
    setIndex(0);
    setFlipped(false);
    setKnown([]);
    setDone(false);
    if (newMode) setMode(newMode);
  };

  // ── Mode selection ──────────────────────────────────────────
  if (!mode)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 max-w-sm mx-auto">
        <h2 className="text-2xl font-extrabold text-ink mb-2">Study Hangul</h2>
        <p className="text-muted text-sm mb-10 text-center">
          Choose what you'd like to practice
        </p>
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => setMode('vowels')}
            className="w-full py-4 rounded-2xl bg-ink text-cream font-bold text-sm flex items-center justify-between px-5 hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <span
                className="text-2xl"
                style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
              >
                아
              </span>
              <span>Vowels</span>
            </div>
            <span className="text-muted text-xs font-semibold">
              {hangulVowels.length} characters
            </span>
          </button>
          <button
            onClick={() => setMode('consonants')}
            className="w-full py-4 rounded-2xl bg-ink text-cream font-bold text-sm flex items-center justify-between px-5 hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <span
                className="text-2xl"
                style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
              >
                가
              </span>
              <span>Consonants</span>
            </div>
            <span className="text-muted text-xs font-semibold">
              {hangulConsonants.length} characters
            </span>
          </button>
          <button
            onClick={() => setMode('all')}
            className="w-full py-4 rounded-2xl border-2 border-border bg-white font-bold text-sm flex items-center justify-between px-5 hover:bg-cream transition-colors"
          >
            <div className="flex items-center gap-3 text-ink">
              <span
                className="text-2xl"
                style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
              >
                한
              </span>
              <span>All Characters</span>
            </div>
            <span className="text-muted text-xs font-semibold">
              {hangulVowels.length + hangulConsonants.length} characters
            </span>
          </button>
        </div>
        <button
          onClick={() => router.back()}
          className="mt-8 text-sm text-muted hover:text-ink transition-colors"
        >
          ← Back
        </button>
      </div>
    );

  // ── Session complete ────────────────────────────────────────
  if (done)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8">
        <span className="text-6xl mb-5">🎉</span>
        <h2 className="text-2xl font-extrabold text-ink mb-2">
          Session Complete!
        </h2>
        <p className="text-muted mb-8 text-center">
          {known.length} / {cards.length} characters mastered
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => reset(mode)}
            className="w-full py-3.5 rounded-xl border-2 border-border bg-white font-bold text-sm text-ink hover:bg-cream transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => reset()}
            className="w-full py-3.5 rounded-xl bg-ink text-cream font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Choose Different Set
          </button>
        </div>
      </div>
    );

  // ── Study session ───────────────────────────────────────────
  const card = cards[index];

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => reset()}
          className="text-2xl text-muted hover:text-ink transition-colors"
        >
          ←
        </button>
        <div className="flex-1">
          <ProgressBar
            progress={index / cards.length}
            color="#111111"
            height={5}
          />
        </div>
        <span className="text-xs font-semibold text-muted">
          {index + 1} / {cards.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <FlipCard
          height={290}
          flipped={flipped}
          onFlip={() => setFlipped(!flipped)}
          className="w-full max-w-sm"
          front={
            <div className="h-full bg-navy rounded-3xl flex flex-col items-center justify-center p-8 shadow-xl cursor-pointer">
              <p className="text-[11px] text-gray-500 tracking-widest mb-6 font-bold">
                TAP TO REVEAL
              </p>
              <p
                className="text-[100px] font-bold text-cream leading-none"
                style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
              >
                {card.char}
              </p>
            </div>
          }
          back={
            <div className="h-full bg-white rounded-3xl border-2 border-border flex flex-col items-center justify-center p-8 cursor-pointer">
              <p
                className="text-6xl font-bold text-ink mb-4"
                style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
              >
                {card.char}
              </p>
              <p className="text-3xl font-extrabold text-red mb-2">
                {card.romanization}
              </p>
              <p className="text-sm text-muted">{card.sound}</p>
            </div>
          }
        />

        {flipped ? (
          <div className="flex gap-3 w-full max-w-sm">
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 py-3.5 rounded-xl border-2 border-border bg-white font-bold text-sm text-ink hover:bg-cream transition-colors"
            >
              ✗ Still Learning
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity text-white"
              style={{ backgroundColor: '#22C55E' }}
            >
              ✓ Know it
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-xs text-muted">
              Tap the card to see the translation
            </p>
            <button
              onClick={() => setSoundEnabled((s) => !s)}
              className="text-xs text-muted hover:text-ink transition-colors"
              title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
