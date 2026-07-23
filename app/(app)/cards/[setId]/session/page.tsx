'use client';
import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useFlashcards, useSaveCardProgress } from '@/hooks/useFlashcards';
import { useAuth } from '@/lib/auth';
import { addXp } from '@/lib/xp';
import ProgressBar from '@/components/ProgressBar';
import ReportIssueButton from '@/components/ReportIssueButton';
import { playCorrect, playIncorrect } from '@/lib/sounds';
import SoundToggleButton from '@/components/SoundToggleButton';
import { FlashcardWithCloze } from '@/types';
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
            className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-muted hover:text-ink text-lg"
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
              <span className="text-[9px] font-semibold text-orange">
                {c.romanization}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function speakWithBrowserTts(text: string) {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR';
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

// Prefers the pre-generated TTS clip (real voice, consistent quality)
// over the browser's native SpeechSynthesis, which varies wildly by
// device/OS and often has no decent Korean voice installed at all.
// Falls back to it only if a card hasn't been regenerated yet.
function speakKorean(text: string, audioUrl?: string) {
  if (typeof window === 'undefined') return;
  if (audioUrl) {
    new Audio(audioUrl).play().catch(() => speakWithBrowserTts(text));
    return;
  }
  speakWithBrowserTts(text);
}

function buildAnsweredSentence(cloze: string, word: string, color: string) {
  const parts = cloze.split('___');
  if (parts.length !== 2)
    return (
      <span style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{cloze}</span>
    );
  return (
    <span style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
      {parts[0]}
      <span style={{ color, fontWeight: 800 }}>{word}</span>
      {parts[1]}
    </span>
  );
}

type AnswerState = 'idle' | 'correct' | 'wrong' | 'unknown';

export default function VocabSessionPage() {
  const { setId } = useParams<{ setId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReviewMode = searchParams.get('mode') === 'review';
  const { user, refreshProfile } = useAuth();
  const { cards, loading } = useFlashcards(setId);
  const saveProgress = useSaveCardProgress();

  const [index, setIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [chosenOption, setChosenOption] = useState<string | null>(null);
  const [known, setKnown] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showHangul, setShowHangul] = useState(false);
  const [shake, setShake] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [knownIds, setKnownIds] = useState<Set<string> | null>(null);

  // ── Review mode: fetch which cards in this set are already known ──
  useEffect(() => {
    if (!isReviewMode) {
      setKnownIds(null);
      return;
    }
    if (!user || !setId) return;
    getDocs(
      query(
        collection(db, 'user_card_progress'),
        where('user_id', '==', user.uid),
        where('set_id', '==', setId),
        where('known', '==', true)
      )
    ).then((snap) => {
      setKnownIds(new Set(snap.docs.map((d) => d.data().card_id as string)));
    });
  }, [isReviewMode, user, setId]);

  const reviewLoading = isReviewMode && knownIds === null;

  // ── All hooks must come before any early returns ─────────────────
  const sourceCards = useMemo(() => {
    if (!isReviewMode || !knownIds) return cards;
    return cards.filter((c) => knownIds.has(c.id));
  }, [cards, isReviewMode, knownIds]);

  const shuffledCards = useMemo(
    () => [...sourceCards].sort(() => Math.random() - 0.5),
    [sourceCards]
  );

  const card = shuffledCards[index] as FlashcardWithCloze | undefined;

  const options = useMemo(() => {
    if (!card) return [];
    const all = [
      card.cloze_answer,
      ...(card.cloze_distractors ?? []).slice(0, 3),
    ];
    return [...all].sort(() => Math.random() - 0.5);
  }, [card?.id]);

  useEffect(() => {
    setAnswerState('idle');
    setChosenOption(null);
    setShowTranslation(false);
  }, [index]);

  // ── Early returns after all hooks ────────────────────────────────
  if (loading || reviewLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (shuffledCards.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8">
        <p className="text-muted text-center">
          {isReviewMode ? 'No mastered cards to review yet.' : 'No cards in this set yet.'}
        </p>
        <button
          onClick={() => router.push(`/cards/${setId}`)}
          className="bg-ink text-cream px-6 py-3 rounded-xl font-bold text-sm"
        >
          Go Back
        </button>
      </div>
    );

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8">
        <span className="text-6xl mb-5">🎉</span>
        <h2 className="text-2xl font-quicksand font-bold text-ink mb-2">
          Session Complete!
        </h2>
        <p className="text-muted mb-2 text-center">
          {known.length} / {shuffledCards.length} correct
        </p>
        {xpEarned > 0 && (
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl mb-6"
            style={{ background: '#F0F7FF' }}
          >
            <span>⚡</span>
            <p className="text-sm font-bold text-ink">
              +{xpEarned} XP earned{xpEarned === 15 ? ' · Perfect!' : ''}
            </p>
          </div>
        )}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => {
              setIndex(0);
              setKnown([]);
              setDone(false);
              setXpEarned(0);
            }}
            className="w-full py-3.5 rounded-xl border-2 border-border bg-white font-bold text-sm text-ink hover:bg-cream transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push(`/cards/${setId}`)}
            className="btn-press w-full py-3.5 rounded-xl bg-navy text-cream font-bold text-sm"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  if (!card) return null;

  // ── Handlers ─────────────────────────────────────────────────────
  const handleAnswer = async (option: string) => {
    if (answerState !== 'idle') return;
    setChosenOption(option);
    const correct = option === card.cloze_answer;
    if (correct) {
      setAnswerState('correct');
      setKnown((k) => [...k, index]);
      playCorrect();
    } else {
      setAnswerState('wrong');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      playIncorrect();
    }
    await saveProgress(card.id, setId, correct);
  };

  const handleDontKnow = async () => {
    if (answerState !== 'idle') return;
    setChosenOption(null);
    setAnswerState('unknown');
    await saveProgress(card.id, setId, false);
  };

  const handleNext = async () => {
    if (index + 1 >= shuffledCards.length) {
      if (user) {
        const isPerfect =
          known.length + (answerState === 'correct' ? 1 : 0) ===
          shuffledCards.length;
        const xp = isPerfect ? 15 : 10;
        setXpEarned(xp);
        await addXp(user.uid, xp);
        await refreshProfile();
      }
      setDone(true);
      return;
    }
    setTransitioning(true);
    setTimeout(() => {
      setIndex((i) => i + 1);
      setTransitioning(false);
    }, 150);
  };

  // ── Derived values ────────────────────────────────────────────────
  const cardBg =
    answerState === 'correct'
      ? '#F0FFF4'
      : answerState === 'wrong'
        ? '#FFF5F5'
        : answerState === 'unknown'
          ? '#F7F4EE'
          : '#1A1F36';

  const cardBorder =
    answerState === 'correct'
      ? '2px solid #86EFAC'
      : answerState === 'wrong'
        ? '2px solid #FCA5A5'
        : answerState === 'unknown'
          ? '2px solid #E8E3D8'
          : 'none';

  const fullSentence =
    card.cloze_sentence?.replace('___', card.cloze_answer) ?? '';

  // ── Render ────────────────────────────────────────────────────────
  return (
    <>
      {showHangul && <HangulModal onClose={() => setShowHangul(false)} />}

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-6px); }
          80%      { transform: translateX(6px); }
        }
        .shake { animation: shake 0.45s ease; }
      `}</style>

      <div
        className="min-h-screen flex flex-col px-6 py-8 max-w-xl mx-auto"
        style={{
          opacity: transitioning ? 0 : 1,
          transition: 'opacity 0.15s ease',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push(`/cards/${setId}`)}
            className="text-2xl text-muted hover:text-ink transition-colors"
          >
            ←
          </button>
          <div className="flex-1">
            <ProgressBar
              progress={index / shuffledCards.length}
              color="#111111"
              height={5}
            />
          </div>
          <span className="text-xs font-semibold text-muted mr-1">
            {index + 1} / {shuffledCards.length}
          </span>
          <SoundToggleButton className="text-lg text-muted hover:text-ink transition-colors mr-1" />
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
        </div>

        {isReviewMode && (
          <div className="flex items-center gap-1.5 mb-4 self-center px-3 py-1 rounded-full" style={{ background: '#EAF6EE' }}>
            <span className="text-xs font-bold" style={{ color: '#1E8E3E' }}>Reviewing mastered cards</span>
          </div>
        )}

        {/* Vocab card */}
        <motion.div
          className={`rounded-3xl p-8 mb-5 flex flex-col items-center justify-center min-h-[220px] transition-all ${shake ? 'shake' : ''}`}
          style={{ background: cardBg, border: cardBorder }}
          animate={answerState === 'correct' ? { scale: [1, 1.02, 1] } : undefined}
          transition={{ duration: 0.3 }}
        >
          {answerState === 'idle' ? (
            <>
              <p className="text-[11px] text-gray-500 tracking-widest mb-5 font-bold">
                FILL IN THE BLANK
              </p>
              <p
                className="text-2xl font-semibold text-center leading-10"
                style={{
                  fontFamily: 'Noto Sans KR, sans-serif',
                  color: '#F7F4EE',
                }}
              >
                {card.cloze_sentence ?? card.sentence_parts.join('')}
              </p>
            </>
          ) : (
            <>
              <p
                className="text-[11px] tracking-widest mb-5 font-bold"
                style={{
                  color: answerState === 'correct'
                    ? '#16A34A'
                    : answerState === 'wrong'
                      ? '#E8412C'
                      : '#888888',
                }}
              >
                {answerState === 'correct'
                  ? '✓ CORRECT'
                  : answerState === 'wrong'
                    ? '✗ INCORRECT'
                    : "HERE'S THE ANSWER"}
              </p>
              <p
                className="text-2xl font-semibold text-center leading-10 mb-3"
                style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
              >
                {buildAnsweredSentence(
                  card.cloze_sentence ?? '',
                  card.cloze_answer,
                  answerState === 'correct'
                    ? '#16A34A'
                    : answerState === 'wrong'
                      ? '#E8412C'
                      : '#F97316'
                )}
              </p>
              <button
                onClick={() => speakKorean(fullSentence, card.audio_url)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs hover:opacity-90 transition-opacity mt-2"
                style={{ background: '#1A1F36', color: '#F7F4EE' }}
              >
                <span>🔊</span>
                <span>Hear sentence</span>
              </button>
            </>
          )}
        </motion.div>

        {/* Show translation */}
        <button
          onClick={() => setShowTranslation((s) => !s)}
          className="text-xs font-semibold text-muted hover:text-ink transition-colors mb-4 text-center"
        >
          {showTranslation ? 'Hide translation ↑' : 'Show translation ↓'}
        </button>
        {showTranslation && (
          <div className="bg-white rounded-2xl border border-border px-5 py-3 mb-4 text-center">
            <p className="text-sm font-semibold text-ink">
              {answerState !== 'idle'
                ? card.cloze_translation
                : card.translation}
            </p>
          </div>
        )}

        {/* Wrong / don't-know answer hint */}
        {(answerState === 'wrong' || answerState === 'unknown') && (
          <div className="bg-white rounded-2xl border-2 border-green px-5 py-3 mb-4 text-center">
            <p className="text-xs text-muted mb-1">Correct answer</p>
            <p
              className="font-bold text-green text-lg"
              style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
            >
              {card.cloze_answer}
            </p>
          </div>
        )}

        {/* Word bank */}
        {answerState === 'idle' && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="py-4 rounded-2xl border-2 border-border bg-white font-bold text-xl text-ink hover:border-ink transition-all active:scale-95"
                  style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button
              onClick={handleDontKnow}
              className="w-full py-3 rounded-2xl border-2 border-border bg-white font-semibold text-sm text-muted hover:border-ink hover:text-ink transition-all mb-6"
            >
              I don't know this one
            </button>
          </>
        )}

        {/* Post-answer chips */}
        {answerState !== 'idle' && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {options.map((opt, i) => {
              const isCorrect = opt === card.cloze_answer;
              const isChosen = opt === chosenOption;
              return (
                <div
                  key={i}
                  className="py-4 rounded-2xl border-2 text-center font-bold text-xl"
                  style={{
                    fontFamily: 'Noto Sans KR, sans-serif',
                    background: isCorrect
                      ? '#F0FFF4'
                      : isChosen
                        ? '#FFF5F5'
                        : '#fff',
                    borderColor: isCorrect
                      ? '#86EFAC'
                      : isChosen
                        ? '#FCA5A5'
                        : '#E8E3D8',
                    color: isCorrect
                      ? '#16A34A'
                      : isChosen
                        ? '#E8412C'
                        : '#aaa',
                  }}
                >
                  {opt}
                </div>
              );
            })}
          </div>
        )}

        {/* Next button */}
        {answerState !== 'idle' && (
          <button
            onClick={handleNext}
            className="btn-press w-full py-4 rounded-2xl bg-navy text-cream font-quicksand font-bold text-base"
          >
            {index + 1 >= shuffledCards.length ? 'Finish ✓' : 'Next →'}
          </button>
        )}

        <div className="flex justify-center mt-4">
          <ReportIssueButton
            module="vocab"
            content_id={setId}
            item_id={card.id}
            item_index={index}
            snapshot={{
              sentence: card.cloze_sentence,
              answer: card.cloze_answer,
              distractors: card.cloze_distractors,
              translation: card.translation,
              chosen_option: chosenOption,
            }}
          />
        </div>
      </div>
    </>
  );
}
