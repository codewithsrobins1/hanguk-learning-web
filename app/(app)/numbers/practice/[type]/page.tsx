'use client';
import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { addXp } from '@/lib/xp';
import { playCorrect, playIncorrect, playLessonComplete } from '@/lib/sounds';
import SoundToggleButton from '@/components/SoundToggleButton';
import ReportIssueButton from '@/components/ReportIssueButton';
import ProgressBar from '@/components/ProgressBar';
import { SINO_QUIZ, NATIVE_QUIZ } from '@/data/numbers';

function shuffledIndices(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

type AnswerState = 'idle' | 'correct' | 'wrong';

export default function NumbersPracticePage() {
  const { type } = useParams<{ type: string }>();
  const router = useRouter();
  const { user, refreshProfile } = useAuth();

  const pool = type === 'sino' ? SINO_QUIZ : type === 'native' ? NATIVE_QUIZ : null;
  const title = type === 'sino' ? 'Sino-Korean' : 'Native Korean';

  const shuffledPool = useMemo(() => {
    if (!pool) return [];
    return shuffledIndices(pool.length).map((i) => pool[i]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool]);

  const [index, setIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [shake, setShake] = useState(false);

  const currentQ = shuffledPool[index];

  const optionOrder = useMemo(() => {
    if (!currentQ) return [];
    return shuffledIndices(currentQ.options.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQ]);

  if (!pool) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted">Unknown quiz type.</p>
        <button onClick={() => router.push('/numbers')} className="bg-navy text-cream px-6 py-3 rounded-2xl font-bold text-sm">
          Back to Numbers
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-xl mx-auto px-6 py-10 flex flex-col items-center text-center">
        <p className="text-5xl mb-4">🎉</p>
        <h2 className="font-quicksand font-bold text-ink text-2xl mb-1">{title} complete!</h2>
        <p className="text-sm text-muted mb-2">{score} / {shuffledPool.length} correct</p>
        {xpEarned > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl mb-6" style={{ background: '#F0F7FF' }}>
            <span>⚡</span>
            <p className="text-sm font-bold text-ink">+{xpEarned} XP earned{xpEarned === 15 ? ' · Perfect!' : ''}</p>
          </div>
        )}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => { setIndex(0); setScore(0); setDone(false); setXpEarned(0); setAnswerState('idle'); setChosen(null); }}
            className="w-full py-3.5 rounded-xl border-2 border-border bg-white font-bold text-sm text-ink hover:bg-cream transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/numbers')}
            className="btn-press w-full bg-navy text-cream py-4 rounded-2xl font-quicksand font-bold text-base"
          >
            ← Back to Numbers
          </button>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  const handleAnswer = (optIdx: number) => {
    if (answerState !== 'idle') return;
    setChosen(optIdx);
    const correct = optionOrder[optIdx] === currentQ.answer_index;
    if (correct) {
      setAnswerState('correct');
      setScore((s) => s + 1);
      playCorrect();
    } else {
      setAnswerState('wrong');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      playIncorrect();
    }
  };

  const handleNext = async () => {
    if (index + 1 >= shuffledPool.length) {
      if (user) {
        const finalScore = score;
        const isPerfect = finalScore === shuffledPool.length;
        const xp = isPerfect ? 15 : 10;
        setXpEarned(xp);
        await addXp(user.uid, xp);
        await refreshProfile();
      }
      playLessonComplete();
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setAnswerState('idle');
    setChosen(null);
  };

  const correctOptionPos = optionOrder.indexOf(currentQ.answer_index);

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push('/numbers')} className="text-2xl text-muted hover:text-ink transition-colors">←</button>
        <div className="flex-1">
          <ProgressBar progress={index / shuffledPool.length} color="#111111" height={5} />
        </div>
        <span className="text-xs font-semibold text-muted mr-1">{index + 1} / {shuffledPool.length}</span>
        <SoundToggleButton className="text-lg text-muted hover:text-ink transition-colors" />
      </div>

      <p className="text-[11px] font-bold text-muted tracking-widest mb-3 text-center">{title.toUpperCase()}</p>

      {/* Question card */}
      <div
        className={`rounded-3xl p-8 mb-5 flex items-center justify-center min-h-[160px] transition-all ${shake ? 'shake' : ''}`}
        style={{
          background: answerState === 'correct' ? '#F0FFF4' : answerState === 'wrong' ? '#FFF5F5' : '#1A1F36',
          border: answerState === 'correct' ? '2px solid #86EFAC' : answerState === 'wrong' ? '2px solid #FCA5A5' : 'none',
        }}
      >
        <p
          className="text-4xl font-bold text-center"
          style={{
            fontFamily: currentQ.isKoreanPrompt ? 'Noto Sans KR, sans-serif' : 'Sora, sans-serif',
            color: answerState === 'idle' ? '#F7F4EE' : '#111',
          }}
        >
          {currentQ.prompt}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {optionOrder.map((originalIdx, i) => {
          const opt = currentQ.options[originalIdx];
          const isChosen = chosen === i;
          const isCorrectPos = answerState !== 'idle' && i === correctOptionPos;
          const isWrongChosen = answerState === 'wrong' && isChosen;
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={answerState !== 'idle'}
              className="py-4 rounded-2xl border-2 font-bold text-xl text-center transition-all active:scale-95"
              style={{
                fontFamily: currentQ.isKoreanPrompt ? 'Sora, sans-serif' : 'Noto Sans KR, sans-serif',
                background: isCorrectPos ? '#F0FFF4' : isWrongChosen ? '#FFF5F5' : '#fff',
                borderColor: isCorrectPos ? '#86EFAC' : isWrongChosen ? '#FCA5A5' : '#E8E3D8',
                color: isCorrectPos ? '#16A34A' : isWrongChosen ? '#E8412C' : '#111',
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center mb-4">
        <ReportIssueButton
          module="numbers"
          content_id={type}
          item_index={index}
          snapshot={{
            prompt: currentQ.prompt,
            options: currentQ.options,
            answer: currentQ.options[currentQ.answer_index],
          }}
        />
      </div>

      {answerState !== 'idle' && (
        <button
          onClick={handleNext}
          className="btn-press w-full py-4 rounded-2xl bg-navy text-cream font-quicksand font-bold text-base"
        >
          {index + 1 >= shuffledPool.length ? 'Finish ✓' : 'Next →'}
        </button>
      )}
    </div>
  );
}
