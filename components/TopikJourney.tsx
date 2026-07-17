'use client';
import { getLevelProgress, isLevelUnlocked, TopikProgressDoc, DotColor } from '@/hooks/useTopik';

const DOT_COLORS: Record<DotColor, string> = {
  green: '#34A853',
  orange: '#F0A030',
  red: '#E8412C',
};

const LEVELS = [1, 2, 3, 4, 5, 6];

export default function TopikJourney({
  progress,
  title,
}: {
  progress: TopikProgressDoc | null;
  title?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 6px 20px rgba(26,31,54,0.06)' }}>
      {title && <p className="font-quicksand font-bold text-ink text-base mb-4 pl-1">{title}</p>}
      <div className="flex justify-between relative px-1">
        <div className="absolute h-[2px] top-[13px] left-5 right-5" style={{ background: 'rgba(26,31,54,0.08)' }} />
        {LEVELS.map((level) => {
          const unlocked = isLevelUnlocked(progress, level);
          const lp = getLevelProgress(progress, level);
          return (
            <div key={level} className="flex flex-col items-center gap-1.5 relative z-10">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: unlocked ? '#1A1F36' : '#FFFFFF',
                  border: unlocked ? 'none' : '2px solid rgba(26,31,54,0.15)',
                }}
              >
                <span className="font-quicksand font-bold text-[11px]" style={{ color: unlocked ? '#FFFFFF' : '#888888' }}>
                  {level}
                </span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => {
                  const a = lp.attempts[i];
                  return (
                    <div
                      key={i}
                      className="w-1 h-1 rounded-full"
                      style={{ background: a ? DOT_COLORS[a.dot_color] : 'rgba(26,31,54,0.1)' }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
