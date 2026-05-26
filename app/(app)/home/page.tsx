'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useUserStats } from '@/hooks/useUserStats';
import { useRandomCard } from '@/hooks/useFlashcards';
import ProgressBar from '@/components/ProgressBar';
import FlipCard from '@/components/FlipCard';
import { doc, updateDoc } from 'firebase/firestore';
import { SECTIONS } from '@/lib/sections';
import { db } from '@/lib/firebase';

const XP_SOURCES = [
  { icon: '⧉', label: 'Flashcard set complete',         xp: '+10 XP' },
  { icon: '⧉', label: 'Flashcard set — perfect score',  xp: '+15 XP', perfect: true },
  { icon: '가', label: 'Hangul session done',            xp: '+10 XP' },
  { icon: '💬', label: 'Shadowing dialogue done',        xp: '+10 XP' },
  { icon: '≡',  label: 'Reading passage + quiz done',    xp: '+10 XP' },
  { icon: '≡',  label: 'Reading passage — perfect quiz', xp: '+15 XP', perfect: true },
];

type GoalDraft = Record<string, number>;

function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <button onClick={() => onChange(Math.max(1, value - 1))}
        className="w-9 h-9 rounded-full border-2 border-border bg-cream font-bold text-ink text-lg flex items-center justify-center hover:border-ink transition-colors">−</button>
      <span className="text-base font-extrabold text-ink w-6 text-center">{value}</span>
      <button onClick={() => onChange(Math.min(99, value + 1))}
        className="w-9 h-9 rounded-full border-2 border-border bg-cream font-bold text-ink text-lg flex items-center justify-center hover:border-ink transition-colors">+</button>
    </div>
  );
}

export default function HomePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { stats } = useUserStats();
  const randomCard = useRandomCard();

  const [cardFlipped,    setCardFlipped]    = useState(false);
  const [showXpModal,    setShowXpModal]    = useState(false);
  const [showGoalModal,  setShowGoalModal]  = useState(false);
  const [goalDraft,      setGoalDraft]      = useState<GoalDraft>(Object.fromEntries(SECTIONS.map(s => [s.key, 3])));
  const [savingGoal,     setSavingGoal]     = useState(false);

  const displayName = profile?.display_name || profile?.username || 'Learner';
  const goals = profile?.goals ?? null;

  const goalRows = goals ? SECTIONS.map(s => ({
    key:    s.key,
    label:  s.label,
    icon:   s.icon,
    color:  s.color,
    done:   Math.max(0, (stats[s.statKey] ?? 0) - (goals.baseline?.[s.key] ?? 0)),
    target: goals.targets?.[s.key] ?? 0,
  })).filter(g => g.target > 0) : [];

  const allGoalsMet = goalRows.length > 0 && goalRows.every(g => g.done >= g.target);

  const handleSaveGoal = async () => {
    if (!user) return;
    setSavingGoal(true);
    await updateDoc(doc(db, 'profiles', user.uid), {
      goals: {
        targets:  goalDraft,
        set_at:   new Date().toISOString(),
        baseline: Object.fromEntries(SECTIONS.map(s => [s.key, stats[s.statKey] ?? 0])),
      },
    });
    await refreshProfile();
    setSavingGoal(false);
    setShowGoalModal(false);
  };

  const handleResetGoal = async () => {
    if (!user) return;
    await updateDoc(doc(db, 'profiles', user.uid), { goals: null });
    await refreshProfile();
  };

  const openEditGoal = () => {
    if (goals) setGoalDraft({ ...goals.targets });
    setShowGoalModal(true);
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-8">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <p className="text-xs text-muted font-semibold mb-1 tracking-wider">안녕하세요!</p>
          <h1 className="font-quicksand font-bold text-ink text-3xl leading-tight">{displayName}</h1>
        </div>
        <div className="bg-navy rounded-2xl px-4 py-3 text-center min-w-[68px] shadow-md">
          <p className="text-[10px] tracking-widest mb-0.5 font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>LEVEL</p>
          <p className="text-cream font-quicksand font-bold text-2xl leading-none">{stats.level}</p>
        </div>
      </div>

      {/* ── XP Bar ─────────────────────────────────────────── */}
      <div className="bg-navy rounded-3xl p-5 mb-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">⚡</span>
            <span className="text-sm font-bold text-cream">Level {stats.level}</span>
            <span className="text-xs text-white/40">→ Level {stats.level + 1}</span>
          </div>
          <span className="text-xs font-semibold text-white/50">{stats.xpIntoLevel} / {stats.xpNeeded} XP</span>
        </div>
        <div className="rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.12)', height: 10 }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.round(stats.xpProgress * 100)}%`, background: '#E8412C' }} />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/40 font-medium">{stats.xpNeeded - stats.xpIntoLevel} XP to next level</p>
          <button onClick={() => setShowXpModal(true)}
            className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors">
            How XP is earned
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-white/25 text-[9px]">?</span>
          </button>
        </div>
      </div>

      {/* ── Overview ───────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-border p-5 mb-5">
        <p className="text-[11px] font-bold text-muted tracking-widest mb-4">OVERVIEW</p>
        <div className="grid grid-cols-2 gap-3">
          {SECTIONS.map(s => {
            const value = (stats as any)[s.statKey] ?? 0;
            const total = (stats as any)[s.totalKey] ?? 0;
            return (
              <div key={s.key} className="bg-cream rounded-2xl p-3.5">
                <p className="text-[10px] font-bold text-muted tracking-wider mb-1.5">{s.overviewLabel}</p>
                <p className="text-xl font-quicksand font-bold text-ink mb-0.5">
                  {value}<span className="text-xs font-semibold text-muted"> / {total}</span>
                </p>
                <p className="text-[10px] text-muted mb-2.5">{s.subLabel}</p>
                <ProgressBar progress={total > 0 ? value / total : 0} color={s.color} />
              </div>
            );
          })}
        </div>
      </div>

            {/* ── Goals ──────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-border p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-bold text-muted tracking-widest">GOALS</p>
          {goals && !allGoalsMet && (
            <button onClick={openEditGoal} className="text-xs font-semibold text-muted hover:text-ink transition-colors">Edit</button>
          )}
        </div>

        {!goals ? (
          <div className="flex flex-col items-center py-5 gap-4">
            <div className="text-3xl">🎯</div>
            <p className="text-sm text-muted text-center">No goals set yet. Set a target to track your daily progress.</p>
            <button onClick={() => setShowGoalModal(true)}
              className="btn-press-navy bg-navy text-cream px-6 py-3 rounded-2xl font-quicksand font-bold text-sm">
              Set a goal →
            </button>
          </div>
        ) : allGoalsMet ? (
          <div className="flex flex-col items-center py-5 gap-3">
            <p className="text-4xl">🎉</p>
            <p className="font-quicksand font-bold text-ink text-xl">You've met your goal!</p>
            <p className="text-xs text-muted text-center">Amazing work. Reset to set a new challenge.</p>
            <button onClick={handleResetGoal}
              className="px-5 py-2.5 rounded-xl border-2 border-border font-bold text-sm text-ink hover:bg-cream transition-colors">
              Reset Goals
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {goalRows.map(g => {
              const pct = Math.min(1, g.done / g.target);
              const met = g.done >= g.target;
              return (
                <div key={g.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{g.icon}</span>
                      <p className={`text-xs font-bold transition-all ${met ? 'line-through text-muted' : 'text-ink'}`}>{g.label}</p>
                      {met && <span className="text-[11px] font-bold" style={{ color: '#16A34A' }}>✓</span>}
                    </div>
                    <p className="text-xs font-semibold" style={{ color: met ? '#16A34A' : '#888' }}>
                      {g.done} / {g.target}
                    </p>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ background: '#F7F4EE', height: 8 }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.round(pct * 100)}%`, background: met ? '#16A34A' : g.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Quick Practice ─────────────────────────────────── */}
      {randomCard && (
        <div className="mb-8">
          <p className="text-[11px] font-bold text-muted tracking-widest mb-3">QUICK PRACTICE</p>
          <FlipCard
            height={140}
            flipped={cardFlipped}
            onFlip={() => setCardFlipped(!cardFlipped)}
            front={
              <div className="h-full bg-navy rounded-3xl flex flex-col items-center justify-center p-6 cursor-pointer">
                <p className="text-[10px] text-white/30 tracking-widest mb-3 font-semibold">TAP TO REVEAL</p>
                <p className="text-xl font-semibold text-cream text-center leading-relaxed"
                  style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                  {randomCard.sentence_parts.map((part, i) =>
                    i === randomCard.key_index
                      ? <span key={i} className="text-red font-extrabold">{part}</span>
                      : <span key={i}>{part}</span>
                  )}
                </p>
              </div>
            }
            back={
              <div className="h-full bg-cream rounded-3xl flex flex-col items-center justify-center p-6 cursor-pointer"
                style={{ border: '2px solid #1A1F36' }}>
                <p className="text-[10px] text-muted tracking-widest mb-2 font-semibold">TRANSLATION</p>
                <p className="text-lg font-quicksand font-bold text-ink text-center">{randomCard.translation}</p>
              </div>
            }
          />
        </div>
      )}

      {/* ── Goal Modal ─────────────────────────────────────── */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowGoalModal(false)}>
          <div className="bg-white w-full max-w-sm rounded-4xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-quicksand font-bold text-ink text-lg">Set your goal</p>
              <button onClick={() => setShowGoalModal(false)}
                className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-muted hover:text-ink text-sm">✕</button>
            </div>
            <p className="text-xs text-muted mb-6">Progress counts from when you save this goal.</p>
            <div className="flex flex-col gap-5 mb-6">
              {SECTIONS.map(({ key, label, icon }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base w-5 text-center">{icon}</span>
                    <span className="text-sm font-semibold text-ink">{label}</span>
                  </div>
                  <Stepper value={goalDraft[key] ?? 3}
                    onChange={v => setGoalDraft(prev => ({ ...prev, [key]: v }))} />
                </div>
              ))}
            </div>
            <button onClick={handleSaveGoal} disabled={savingGoal}
              className="btn-press w-full bg-navy text-cream py-4 rounded-2xl font-quicksand font-bold text-base">
              {savingGoal ? 'Saving...' : 'Save Goal'}
            </button>
          </div>
        </div>
      )}

      {/* ── XP Modal ───────────────────────────────────────── */}
      {showXpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowXpModal(false)}>
          <div className="bg-white w-full max-w-sm rounded-4xl p-6 mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <p className="font-quicksand font-bold text-ink text-lg">How XP is earned</p>
              <button onClick={() => setShowXpModal(false)}
                className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-muted hover:text-ink text-sm">✕</button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border">
              {XP_SOURCES.map((s, i) => (
                <div key={i}
                  className={`flex items-center justify-between px-4 py-3 ${i < XP_SOURCES.length - 1 ? 'border-b border-border' : ''} ${i % 2 === 0 ? 'bg-white' : 'bg-cream'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-base w-5 text-center">{s.icon}</span>
                    <span className="text-sm text-ink">{s.label}</span>
                    {s.perfect && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: '#FDE8E4', color: '#E8412C' }}>perfect</span>
                    )}
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-lg bg-navy text-cream">{s.xp}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted text-center mt-4">XP never resets — progress always counts</p>
          </div>
        </div>
      )}
    </div>
  );
}
