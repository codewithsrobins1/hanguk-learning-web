'use client';
import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useTopikTests, savePlacementResult, TopikReadingQuestion } from '@/hooks/useTopik';

const TOTAL_QUESTIONS = 18;

type PoolItem = { key: string; level: number; q: TopikReadingQuestion };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clampLevel(n: number) {
  return Math.max(1, Math.min(6, n));
}

export default function PlacementTestPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { tests, loading } = useTopikTests();

  const pool = useMemo(() => {
    const items: PoolItem[] = [];
    tests.forEach((t) => {
      t.reading_questions.forEach((q, qi) => {
        items.push({ key: `${t.id}_${qi}`, level: t.level, q });
      });
    });
    return shuffle(items);
  }, [tests]);

  const [phase, setPhase] = useState<'intro' | 'quiz' | 'done'>('intro');
  const [qIndex, setQIndex] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(3);
  const [step, setStep] = useState(2);
  const [lastDirection, setLastDirection] = useState<0 | 1 | -1>(0);
  const [levelHistory, setLevelHistory] = useState<number[]>([]);
  const [usedKeys, setUsedKeys] = useState<Set<string>>(new Set());
  const [current, setCurrent] = useState<PoolItem | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [recommendedLevel, setRecommendedLevel] = useState(1);
  const [saving, setSaving] = useState(false);

  const pickQuestion = useCallback((level: number, used: Set<string>, sourcePool: PoolItem[]) => {
    for (let offset = 0; offset < 6; offset++) {
      for (const candidateLevel of [level - offset, level + offset]) {
        if (candidateLevel < 1 || candidateLevel > 6) continue;
        const match = sourcePool.find((item) => item.level === candidateLevel && !used.has(item.key));
        if (match) return match;
      }
    }
    return sourcePool.find((item) => !used.has(item.key)) ?? null;
  }, []);

  const handleStart = () => {
    const first = pickQuestion(3, new Set(), pool);
    if (!first) return;
    setCurrent(first);
    setUsedKeys(new Set([first.key]));
    setPhase('quiz');
  };

  const finish = async (history: number[]) => {
    const tail = history.slice(-8);
    const avg = tail.reduce((sum, l) => sum + l, 0) / tail.length;
    const recommended = clampLevel(Math.round(avg));
    setRecommendedLevel(recommended);
    if (user) {
      setSaving(true);
      await savePlacementResult(user.uid, recommended);
      setSaving(false);
    }
    setPhase('done');
  };

  const handleAnswer = (idx: number) => {
    if (selected !== null || !current) return;
    setSelected(idx);

    const correct = idx === current.q.answer_index;
    const direction: 1 | -1 = correct ? 1 : -1;
    let nextStep = step;
    if (lastDirection !== 0 && direction !== lastDirection) {
      nextStep = Math.max(1, Math.floor(step / 2));
    }
    const nextLevel = clampLevel(currentLevel + direction * nextStep);
    const newHistory = [...levelHistory, current.level];

    setTimeout(() => {
      if (qIndex + 1 >= TOTAL_QUESTIONS) {
        finish(newHistory);
        return;
      }
      const nextUsed = new Set(usedKeys);
      const next = pickQuestion(nextLevel, nextUsed, pool);
      if (!next) {
        finish(newHistory);
        return;
      }
      nextUsed.add(next.key);
      setUsedKeys(nextUsed);
      setLevelHistory(newHistory);
      setCurrentLevel(nextLevel);
      setStep(nextStep);
      setLastDirection(direction);
      setCurrent(next);
      setSelected(null);
      setQIndex((i) => i + 1);
    }, 350);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-red border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // ── Intro ──────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="max-w-xl mx-auto px-6 py-10 flex flex-col items-center text-center">
        <p className="text-5xl mb-4">🎯</p>
        <h1 className="font-quicksand font-bold text-ink text-2xl mb-2">Placement Test</h1>
        <p className="text-sm text-muted mb-1 leading-relaxed">
          {TOTAL_QUESTIONS} questions that get easier or harder based on your answers.
        </p>
        <p className="text-sm text-muted mb-8 leading-relaxed">
          This gives you an estimate of your TOPIK level — it's informational only and doesn't unlock any level. You'll still need to complete Level 1 to start officially.
        </p>
        <button
          onClick={handleStart}
          disabled={pool.length === 0}
          className="btn-press-red w-full max-w-xs py-4 rounded-2xl bg-red text-white font-quicksand font-bold text-base disabled:opacity-50"
        >
          Start Placement Test →
        </button>
        <button
          onClick={() => router.push('/tests')}
          className="mt-4 text-sm text-muted hover:text-ink transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  // ── Done ───────────────────────────────────────────────────────
  if (phase === 'done') {
    return (
      <div className="max-w-xl mx-auto px-6 py-10 flex flex-col items-center text-center">
        <div className="w-28 h-28 rounded-full bg-navy flex flex-col items-center justify-center mb-6" style={{ border: '4px solid #E8412C' }}>
          <span className="text-white/50 text-[10px] font-bold tracking-widest">TOPIK</span>
          <span className="text-cream font-quicksand font-extrabold text-3xl leading-none mt-1">{recommendedLevel}</span>
        </div>
        <h2 className="font-quicksand font-bold text-ink text-2xl mb-2">
          You're approximately Level {recommendedLevel}
        </h2>
        <p className="text-sm text-muted mb-8 leading-relaxed max-w-sm">
          This is just an estimate to help you pick a starting point. Head to Level 1 to begin officially unlocking levels.
        </p>
        <button
          onClick={() => router.push('/tests')}
          className="btn-press w-full max-w-xs py-4 rounded-2xl bg-navy text-cream font-quicksand font-bold text-base"
        >
          Back to Tests
        </button>
      </div>
    );
  }

  // ── Quiz ───────────────────────────────────────────────────────
  if (!current) return null;

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs font-bold text-muted">Question {qIndex + 1} of {TOTAL_QUESTIONS}</p>
        {saving && <p className="text-xs text-muted">Saving…</p>}
      </div>

      <div
        className="rounded-full overflow-hidden mb-6"
        style={{ background: '#E8E3D8', height: 6 }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${(qIndex / TOTAL_QUESTIONS) * 100}%`, background: '#1A1F36' }}
        />
      </div>

      <div className="bg-white rounded-3xl border border-border p-5 mb-5">
        {current.q.passage && (
          <p
            className="text-ink leading-relaxed mb-4"
            style={{ fontFamily: 'Noto Sans KR, sans-serif', fontSize: 21 }}
          >
            {current.q.passage}
          </p>
        )}
        <p
          className="font-bold text-ink leading-snug"
          style={{ fontFamily: 'Noto Sans KR, sans-serif', fontSize: 20 }}
        >
          {current.q.question}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {current.q.options.map((opt, oi) => {
          const isSelected = selected === oi;
          return (
            <button
              key={oi}
              onClick={() => handleAnswer(oi)}
              disabled={selected !== null}
              className={`w-full py-4 px-5 rounded-2xl border-2 text-left font-bold transition-all ${
                isSelected ? 'bg-ink border-ink text-cream' : 'bg-white border-border text-ink hover:border-ink'
              }`}
              style={{ fontFamily: 'Noto Sans KR, sans-serif', fontSize: 19 }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
