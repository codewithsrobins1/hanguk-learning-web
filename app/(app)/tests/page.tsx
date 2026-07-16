'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useTopikProgress,
  getLevelProgress,
  isLevelUnlocked,
  bestScore,
  nextVersionForLevel,
  topikTestId,
  DotColor,
} from '@/hooks/useTopik';

const LEVELS = [
  { level: 1, section: 'TOPIK I' },
  { level: 2, section: 'TOPIK I' },
  { level: 3, section: 'TOPIK II' },
  { level: 4, section: 'TOPIK II' },
  { level: 5, section: 'TOPIK II' },
  { level: 6, section: 'TOPIK II' },
];

const DOT_COLORS: Record<DotColor, string> = {
  green: '#22C55E',
  orange: '#F97316',
  red: '#E8412C',
};

function AttemptDots({ attempts }: { attempts: { dot_color: DotColor }[] }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: 3 }).map((_, i) => {
        const a = attempts[i];
        return (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: a ? DOT_COLORS[a.dot_color] : '#E8E3D8' }}
          />
        );
      })}
    </div>
  );
}

export default function TestsPage() {
  const router = useRouter();
  const { progress, placement, loading } = useTopikProgress();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-red border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="font-quicksand font-bold text-ink text-3xl mb-1">Tests</h1>
      <p className="text-sm text-muted mb-6">Practice tests calibrated to real TOPIK proficiency levels</p>

      {/* Placement hero card */}
      <div className="bg-navy rounded-3xl p-6 mb-8">
        <p className="text-3xl mb-2">🎯</p>
        <p className="font-quicksand font-bold text-cream text-xl mb-1">Test My Level</p>
        <p className="text-white/50 text-sm mb-4 leading-relaxed">
          Not sure where to start? Take a quick adaptive placement test to get an estimate of your TOPIK level. This is informational only — it doesn't unlock anything.
        </p>
        {placement && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <span className="text-white text-sm font-bold">You tested at approximately Level {placement.recommended_level}</span>
          </div>
        )}
        <button
          onClick={() => router.push('/tests/placement')}
          className="btn-press-red w-full py-3.5 rounded-2xl bg-red text-white font-quicksand font-bold text-sm"
        >
          {placement ? 'Retake Placement Test →' : 'Start Placement Test →'}
        </button>
      </div>

      {/* Level grid */}
      <p className="text-[17px] font-bold text-muted tracking-widest mb-1">TOPIK LEVELS</p>
      <p className="text-sm text-muted mb-3">Score 90%+ on 2 of your 3 tries to unlock the next level</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {LEVELS.map(({ level, section }) => {
          const lp = getLevelProgress(progress, level);
          const unlocked = isLevelUnlocked(progress, level);
          const best = bestScore(lp);
          const greenCount = lp.attempts.filter((a) => a.dot_color === 'green').length;
          const testId = topikTestId(level, nextVersionForLevel(lp));

          const cardContent = (
            <>
              <div className="flex items-start justify-between mb-3">
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: '#F7F4EE', color: '#888' }}
                >
                  {section}
                </span>
                {!unlocked && <span className="text-lg">🔒</span>}
              </div>
              <p className="font-quicksand font-bold text-ink text-lg mb-2">Level {level}</p>
              <AttemptDots attempts={lp.attempts} />
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-muted">
                  {best !== null ? `Best: ${best}%` : unlocked ? 'Not attempted' : `Complete Level ${level - 1} to unlock`}
                </p>
                {unlocked && !lp.unlocked_next && (
                  <p className="text-[10px] font-bold text-muted">{greenCount}/2 🟢</p>
                )}
              </div>
            </>
          );

          if (!unlocked) {
            return (
              <div key={level} className="rounded-2xl p-4 opacity-50" style={{ border: '2px solid #E8E3D8', background: '#fff' }}>
                {cardContent}
              </div>
            );
          }

          return (
            <Link
              key={level}
              href={`/tests/${testId}`}
              className="rounded-2xl p-4 bg-white hover:border-ink transition-colors"
              style={{ border: lp.unlocked_next ? '2px solid #86EFAC' : '2px solid #E8E3D8' }}
            >
              {cardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
