'use client';
import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFlashcards, useSaveCardProgress } from '@/hooks/useFlashcards';
import { playCorrect, playIncorrect } from '@/lib/sounds';
import FlipCard from '@/components/FlipCard';
import ProgressBar from '@/components/ProgressBar';
import { hangulVowels, hangulConsonants } from '@/data/hangul';

function HangulModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'vowels' | 'consonants'>('vowels');
  const chars = tab === 'vowels' ? hangulVowels : hangulConsonants;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-ink text-base">
            Hangul Reference
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-muted hover:text-ink transition-colors text-lg"
          >
            ✕
          </button>
        </div>
        <div className="flex gap-2 mb-4 bg-cream rounded-xl p-1">
          <button
            onClick={() => setTab('vowels')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${tab === 'vowels' ? 'bg-ink text-cream' : 'text-muted'}`}
          >
            Vowels ({hangulVowels.length})
          </button>
          <button
            onClick={() => setTab('consonants')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${tab === 'consonants' ? 'bg-ink text-cream' : 'text-muted'}`}
          >
            Consonants ({hangulConsonants.length})
          </button>
        </div>
        <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
          {chars.map((c) => (
            <div
              key={c.char}
              className="flex flex-col items-center justify-center bg-cream rounded-xl border border-border py-2.5"
              style={{ width: 'calc(20% - 7px)' }}
            >
              <span
                className="text-lg font-bold text-ink leading-none mb-1"
                style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
              >
                {c.char}
              </span>
              <span className="text-[9px] font-semibold text-red">
                {c.romanization}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted text-center mt-3">
          Tap a character on the Hangul page for pronunciation details
        </p>
      </div>
    </div>
  );
}

function speakKorean(text: string) {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ko-KR';
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
}

export default function FlashcardSessionPage() {
  const { setId } = useParams<{ setId: string }>();
  const router = useRouter();
  const { cards, loading } = useFlashcards(setId);
  const saveProgress = useSaveCardProgress();

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<number[]>([]);
  const [missed, setMissed] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [reviewCards, setReviewCards] = useState<typeof cards | null>(null);
  const [showHangul, setShowHangul] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [transitioning, setTransitioning] = useState(false);

  // Shuffle cards once on load
  const shuffledCards = useMemo(
    () => [...cards].sort(() => Math.random() - 0.5),
    [cards]
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (cards.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8">
        <p className="text-muted text-center">No cards in this set yet.</p>
        <button
          onClick={() => router.back()}
          className="bg-ink text-cream px-6 py-3 rounded-xl font-bold text-sm"
        >
          Go Back
        </button>
      </div>
    );

  const activeCards = reviewCards ?? shuffledCards;

  const handleAnswer = async (isKnown: boolean) => {
    if (isKnown) {
      setKnown((k) => [...k, index]);
      if (soundEnabled) playCorrect();
    } else {
      setMissed((m) => [...m, index]);
      if (soundEnabled) playIncorrect();
    }
    if (!reviewCards) {
      await saveProgress(activeCards[index].id, setId, isKnown);
    }
    if (index + 1 >= activeCards.length) {
      setDone(true);
      return;
    }
    setTransitioning(true);
    setTimeout(() => {
      setFlipped(false);
      setIndex((i) => i + 1);
      setTransitioning(false);
    }, 150);
  };

  if (done) {
    const missedCards = missed.map((i) => activeCards[i]);
    const isReviewMode = reviewCards !== null;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8">
        <span className="text-6xl mb-5">{isReviewMode ? '📖' : '🎉'}</span>
        <h2 className="text-2xl font-extrabold text-ink mb-2">
          {isReviewMode ? 'Review Complete!' : 'Session Complete!'}
        </h2>
        <p className="text-muted mb-2 text-center">
          {known.length} / {activeCards.length} cards{' '}
          {isReviewMode ? 'reviewed correctly' : 'marked as known'}
        </p>
        {!isReviewMode && (
          <p className="text-xs text-muted mb-8 text-center">
            Missed cards don't affect your mastery score
          </p>
        )}
        {isReviewMode && <div className="mb-8" />}

        <div className="flex flex-col gap-3 w-full max-w-xs">
          {!isReviewMode && missedCards.length > 0 && (
            <button
              onClick={() => {
                setReviewCards(missedCards);
                setIndex(0);
                setFlipped(false);
                setKnown([]);
                setMissed([]);
                setDone(false);
              }}
              className="w-full py-3.5 rounded-xl border-2 border-red font-bold text-sm text-red hover:bg-red hover:text-white transition-colors"
            >
              Review Missed ({missedCards.length})
            </button>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setReviewCards(null);
                setIndex(0);
                setFlipped(false);
                setKnown([]);
                setMissed([]);
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
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  const card = activeCards[index];
  const koreanSentence = card.sentence_parts.join('');

  return (
    <>
      {showHangul && <HangulModal onClose={() => setShowHangul(false)} />}

      <div className="min-h-screen flex flex-col px-6 py-8 max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="text-2xl text-muted hover:text-ink transition-colors"
          >
            ←
          </button>
          <div className="flex-1">
            <ProgressBar
              progress={index / activeCards.length}
              color="#111111"
              height={5}
            />
          </div>
          <span className="text-xs font-semibold text-muted mr-2">
            {index + 1} / {activeCards.length}
          </span>
          <button
            onClick={() => setShowHangul(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cream border border-border hover:border-ink transition-colors"
          >
            <span
              className="text-sm font-bold text-ink"
              style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
            >
              가
            </span>
            <span className="text-[10px] font-bold text-muted">REF</span>
          </button>
          <button
            onClick={() => setSoundEnabled((s) => !s)}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-cream border border-border hover:border-ink transition-colors"
          >
            <span className="text-sm">{soundEnabled ? '🔊' : '🔇'}</span>
          </button>
        </div>

        {/* Card area */}
        <div
          className="flex-1 flex flex-col items-center justify-center gap-6"
          style={{
            opacity: transitioning ? 0 : 1,
            transition: 'opacity 0.15s ease',
          }}
        >
          <FlipCard
            key={index}
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
                  className="text-2xl font-semibold text-cream text-center leading-10"
                  style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
                >
                  {card.sentence_parts.map((part, i) =>
                    i === card.key_index ? (
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
              <div className="h-full bg-white rounded-3xl border-2 border-border flex flex-col items-center justify-center p-8 cursor-pointer">
                <p className="text-[11px] text-muted tracking-widest mb-4 font-bold">
                  TRANSLATION
                </p>
                <p className="text-2xl font-bold text-ink text-center mb-4">
                  {card.translation}
                </p>
                <div className="px-4 py-2.5 bg-cream rounded-xl border-[1.5px] border-border mb-4">
                  <p
                    className="text-m text-muted text-center leading-6"
                    style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
                  >
                    {card.sentence_parts.map((part, i) =>
                      i === card.key_index ? (
                        <span key={i} className="text-ink font-bold">
                          {part}
                        </span>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </p>
                </div>
                {/* TTS button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakKorean(koreanSentence);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy text-cream font-bold text-xs hover:opacity-90 transition-opacity"
                >
                  <span>🔊</span>
                  <span>Hear sentence</span>
                </button>
                <p className="text-[9px] text-muted mt-2 text-center">
                  Tap to hear the full Korean sentence
                </p>
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
                className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#22C55E' }}
              >
                ✓ Know it
              </button>
            </div>
          ) : (
            <p className="text-xs text-muted">
              Tap the card to see the translation
            </p>
          )}
        </div>
      </div>
    </>
  );
}
