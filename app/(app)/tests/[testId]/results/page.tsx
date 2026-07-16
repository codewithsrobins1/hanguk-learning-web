'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useTopikProgress,
  getLevelProgress,
  nextVersionForLevel,
  topikTestId,
  DotColor,
} from '@/hooks/useTopik';

type ResultPayload = {
  attemptNumber: number;
  dotColor: DotColor;
  percent: number;
  unlockedNext: boolean;
  readingScore: number;
  listeningScore: number;
  xpEarned: number;
  testTitle: string;
  level: number;
};

const DOT_COLORS: Record<DotColor, string> = {
  green: '#22C55E',
  orange: '#F97316',
  red: '#E8412C',
};

export default function TopikResultsPage() {
  const { testId } = useParams<{ testId: string }>();
  const router = useRouter();
  const { progress, loading } = useTopikProgress();
  const [result, setResult] = useState<ResultPayload | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(`topik_result_${testId}`);
    if (!raw) {
      setNotFound(true);
      return;
    }
    setResult(JSON.parse(raw) as ResultPayload);
  }, [testId]);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8">
        <p className="text-muted">No results found for this test.</p>
        <button onClick={() => router.push('/tests')} className="bg-navy text-cream px-6 py-3 rounded-2xl font-bold text-sm">
          Back to Tests
        </button>
      </div>
    );
  }

  if (!result || loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-red border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const passed = result.percent >= 90;
  const lp = getLevelProgress(progress, result.level);
  const greenCount = lp.attempts.filter((a) => a.dot_color === 'green').length;
  const nextTestId = topikTestId(result.level, nextVersionForLevel(lp));
  const canRetry = !lp.unlocked_next;

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <p className="text-[11px] font-bold text-muted tracking-widest mb-1">{result.testTitle}</p>
      <h1 className="font-quicksand font-bold text-ink text-2xl mb-6">Results</h1>

      {/* Overall score */}
      <div className="bg-white rounded-3xl border border-border p-6 mb-5 flex flex-col items-center text-center">
        <p className="text-5xl mb-2">{passed ? '🎉' : '💪'}</p>
        <p
          className="text-6xl font-quicksand font-bold mb-1"
          style={{ color: passed ? '#16A34A' : result.percent >= 80 ? '#F97316' : '#E8412C' }}
        >
          {result.percent}%
        </p>
        <p className="text-sm font-bold" style={{ color: passed ? '#16A34A' : '#888' }}>
          {passed ? 'Pass ✓' : 'Keep practicing'}
        </p>
      </div>

      {/* Section breakdown */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white rounded-2xl border border-border p-4">
          <p className="text-[10px] font-bold text-muted tracking-wider mb-1">READING & GRAMMAR</p>
          <p className="text-2xl font-extrabold text-ink">{result.readingScore}/15</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4">
          <p className="text-[10px] font-bold text-muted tracking-wider mb-1">LISTENING</p>
          <p className="text-2xl font-extrabold text-ink">{result.listeningScore}/5</p>
        </div>
      </div>

      {/* XP earned */}
      {result.xpEarned > 0 && (
        <div className="flex items-center gap-2 px-5 py-3 rounded-2xl mb-5" style={{ background: '#F0F7FF' }}>
          <span>⚡</span>
          <p className="text-sm font-bold text-ink">+{result.xpEarned} XP earned</p>
        </div>
      )}

      {/* Attempt dots + unlock progress */}
      <div className="bg-white rounded-2xl border border-border p-5 mb-6">
        <p className="text-[11px] font-bold text-muted tracking-widest mb-3">LEVEL {result.level} ATTEMPTS</p>
        <div className="flex gap-2 mb-3">
          {Array.from({ length: 3 }).map((_, i) => {
            const a = lp.attempts[i];
            return (
              <span key={i} className="w-4 h-4 rounded-full" style={{ background: a ? DOT_COLORS[a.dot_color] : '#E8E3D8' }} />
            );
          })}
        </div>
        {lp.unlocked_next ? (
          <p className="text-sm font-bold" style={{ color: '#16A34A' }}>
            🎉 Level {result.level + 1} unlocked!
          </p>
        ) : (
          <p className="text-sm text-muted">{greenCount}/2 green attempts (90%+) needed to unlock Level {result.level + 1}</p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {canRetry && (
          <button
            onClick={() => router.push(`/tests/${nextTestId}`)}
            className="btn-press-red w-full py-4 rounded-2xl bg-red text-white font-quicksand font-bold text-base"
          >
            Try Test {nextVersionForLevel(lp)} →
          </button>
        )}
        <button
          onClick={() => router.push('/tests')}
          className="btn-press w-full py-4 rounded-2xl bg-navy text-cream font-quicksand font-bold text-base"
        >
          Back to Tests
        </button>
      </div>
    </div>
  );
}
