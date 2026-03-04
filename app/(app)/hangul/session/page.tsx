'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { hangulVowels } from '@/data/hangul';
import FlipCard from '@/components/FlipCard';
import ProgressBar from '@/components/ProgressBar';

export default function HangulSessionPage() {
  const router = useRouter();
  const cards = hangulVowels.slice(0, 10);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const handleAnswer = (isKnown: boolean) => {
    if (isKnown) setKnown((k) => [...k, index]);
    if (index + 1 >= cards.length) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setFlipped(false);
  };

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
        <div className="flex gap-3 w-full max-w-xs">
          <button
            onClick={() => {
              setIndex(0);
              setFlipped(false);
              setKnown([]);
              setDone(false);
            }}
            className="flex-1 py-3.5 rounded-xl border-2 border-border bg-white font-bold text-sm text-ink hover:bg-cream transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.back()}
            className="flex-1 py-3.5 rounded-xl bg-ink text-cream font-bold text-sm hover:bg-inkLight transition-colors"
          >
            Back to Hangul
          </button>
        </div>
      </div>
    );

  const card = cards[index];

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
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
              className="flex-1 py-3.5 rounded-xl bg-green-500 text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              ✓ Know it
            </button>
          </div>
        ) : (
          <p className="text-xs text-muted">Tap the card to see the answer</p>
        )}
      </div>
    </div>
  );
}
