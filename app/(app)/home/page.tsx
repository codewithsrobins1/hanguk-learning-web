'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useUserStats } from '@/hooks/useUserStats';
import { useWeeklyProgress, WEEKLY_TARGETS } from '@/hooks/useWeeklyProgress';
import { useHomeInsight } from '@/hooks/useHomeInsight';
import { useTopikProgress } from '@/hooks/useTopik';
import TopikSeal from '@/components/TopikSeal';
import ProgressBar from '@/components/ProgressBar';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NAV_ITEMS, navPrefKey } from '@/lib/nav-config';

export default function HomePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { stats } = useUserStats();
  const { weekly, refresh: refreshWeekly } = useWeeklyProgress();
  const { insight, loading: insightLoading } = useHomeInsight();
  const { progress: topikProgress, placement: topikPlacement } = useTopikProgress();
  const topikLevel = topikProgress?.highest_level_passed ?? 0;
  const hasAttemptedTopik = !!topikPlacement
    || Object.values(topikProgress?.level_progress ?? {}).some(lp => lp.total_attempts > 0);

  const router = useRouter();
  const [showWeeklyResetConfirm, setShowWeeklyResetConfirm] = useState(false);

  const isNavEnabled = (href: string) => {
    const item = NAV_ITEMS.find(n => n.href === href);
    if (!item) return false;
    return profile?.nav_preferences?.[navPrefKey(href)] ?? item.enabled;
  };

  const weeklyMetrics = [
    { href: '/cards',    label: 'Vocab',     done: weekly.cardsReviewed,  total: WEEKLY_TARGETS.cards,     color: '#F97316' },
    { href: '/read',     label: 'Reading',   done: weekly.passagesDone,   total: WEEKLY_TARGETS.passages,  color: '#1A1F36' },
    { href: '/shadow',   label: 'Speaking',  done: weekly.dialoguesDone,  total: WEEKLY_TARGETS.dialogues, color: '#F97316' },
    { href: '/listen',   label: 'Listening', done: weekly.listeningDone,  total: WEEKLY_TARGETS.listening, color: '#1A1F36' },
    { href: '/patterns', label: 'Patterns',  done: weekly.patternsDone,   total: WEEKLY_TARGETS.patterns,  color: '#F97316' },
    { href: '/grammar',  label: 'Grammar',   done: weekly.grammarDone,    total: WEEKLY_TARGETS.grammar,   color: '#1A1F36' },
  ].filter(m => isNavEnabled(m.href));

  const handleResetWeeklyProgress = async () => {
    if (!user) return;
    await updateDoc(doc(db, 'profiles', user.uid), { weekly_reset_at: new Date().toISOString() });
    await refreshProfile();
    await refreshWeekly();
    setShowWeeklyResetConfirm(false);
  };

  const displayName = profile?.display_name || profile?.username || 'Learner';

  return (
    <div className="max-w-xl lg:max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-5">
        <p className="text-xs text-muted font-medium mb-1">안녕하세요!</p>
        <div className="flex items-center gap-2">
          <h1 className="font-quicksand font-bold text-ink text-3xl">{displayName}</h1>
          {topikLevel > 0 && (
            <span title={`Passed TOPIK Level ${topikLevel}`}>
              <TopikSeal level={topikLevel} size={26} />
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* XP Bar */}
        <div className="bg-white rounded-2xl border-2 border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">⚡</span>
              <span className="text-sm font-bold text-ink">Level {stats.level}</span>
              <span className="text-xs text-muted">→ Level {stats.level + 1}</span>
            </div>
            <span className="text-xs font-semibold text-muted">{stats.xpIntoLevel} / {stats.xpNeeded} XP</span>
          </div>
          <div className="rounded-full overflow-hidden mb-1" style={{ background: '#F7F4EE', height: 10 }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.round(stats.xpProgress * 100)}%`, background: '#F97316' }} />
          </div>
          <p className="text-[11px] text-muted">
            {stats.xpNeeded - stats.xpIntoLevel} XP to level up · {stats.xp} XP total
          </p>
        </div>

        {/* Ready for TOPIK */}
        <div className="bg-navy rounded-2xl p-5 flex flex-col justify-center gap-2">
          <p className="font-quicksand font-bold text-cream text-base">
            {topikLevel > 0
              ? `Passed TOPIK Level ${topikLevel}!`
              : hasAttemptedTopik
                ? 'Ready to try again?'
                : 'Ready for TOPIK I?'}
          </p>
          <p className="text-white/60 text-xs leading-relaxed">
            {topikLevel > 0
              ? `Take Level ${topikLevel + 1} to keep leveling up.`
              : hasAttemptedTopik
                ? 'Jump back in and keep working toward passing your first level.'
                : 'Take a free placement test to see which level fits you best.'}
          </p>
          <button
            onClick={() => router.push('/tests')}
            className="mt-1 py-2.5 rounded-xl bg-orange text-white font-bold text-xs hover:opacity-90 transition-opacity self-start px-5"
          >
            Go to Tests Hub
          </button>
        </div>
      </div>

      {/* Weekly Progress — the main event */}
      <div className="bg-white rounded-3xl p-6 lg:p-8" style={{ boxShadow: '0 6px 20px rgba(26,31,54,0.06)' }}>
        <div className="flex items-center justify-between mb-6">
          <p className="font-quicksand font-bold text-ink text-xl">Weekly Progress</p>
          <button onClick={() => setShowWeeklyResetConfirm(true)}
            className="text-xs font-semibold text-muted hover:text-ink transition-colors">
            Reset
          </button>
        </div>
        {weeklyMetrics.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {weeklyMetrics.map((m) => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-inkLight">{m.label}</p>
                  <p className="text-xs font-bold text-muted">{m.done}/{m.total}</p>
                </div>
                <ProgressBar progress={m.total > 0 ? m.done / m.total : 0} color={m.color} height={10} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">
            All sections are hidden in your nav settings — enable some from Profile to track progress here.
          </p>
        )}
        <p className="text-[11px] text-muted mt-6">Resets every Monday</p>
      </div>

      {/* AI progress summary */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 mt-5" style={{ boxShadow: '0 6px 20px rgba(26,31,54,0.06)' }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">✨</span>
          <p className="font-quicksand font-bold text-ink text-xl">Your Progress, Summarized</p>
        </div>

        {insight ? (
          <>
            <p className="text-sm text-inkLight leading-relaxed mb-5">{insight.summary}</p>
            {insight.recommendations.length > 0 && (
              <div className="bg-cream rounded-2xl p-4">
                <p className="text-[11px] font-bold text-muted tracking-widest mb-2">WEEKLY RECOMMENDATION</p>
                <ul className="flex flex-col gap-1.5">
                  {insight.recommendations.map((r, i) => (
                    <li key={i} className="text-sm text-ink flex items-start gap-2">
                      <span className="text-orange">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : insightLoading ? (
          <p className="text-sm text-muted">Thinking about your week...</p>
        ) : (
          <p className="text-sm text-muted">
            Complete a session or two and we'll start summarizing your progress here.
          </p>
        )}
      </div>

      {/* ── Weekly progress reset confirmation ─────────────────── */}
      {showWeeklyResetConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => setShowWeeklyResetConfirm(false)}>
          <div className="bg-white w-full max-w-sm rounded-3xl p-6" onClick={e => e.stopPropagation()}>
            <p className="text-3xl mb-3 text-center">🔄</p>
            <p className="font-quicksand font-bold text-ink text-lg text-center mb-2">Reset weekly progress?</p>
            <p className="text-sm text-muted text-center mb-6">
              This starts a fresh week now. Your actual vocab, reading, speaking, and listening progress is never deleted — only the weekly bars reset.
            </p>
            <button onClick={handleResetWeeklyProgress}
              className="btn-press-orange w-full bg-orange text-white py-3.5 rounded-2xl font-quicksand font-bold text-sm mb-2">
              Yes, reset weekly progress
            </button>
            <button onClick={() => setShowWeeklyResetConfirm(false)}
              className="w-full py-3 rounded-2xl border-2 border-border font-bold text-sm text-ink hover:bg-cream transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
