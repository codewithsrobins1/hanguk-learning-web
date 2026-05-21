'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useUserStats } from '@/hooks/useUserStats';
import { useRandomCard } from '@/hooks/useFlashcards';
import ProgressBar from '@/components/ProgressBar';
import FlipCard from '@/components/FlipCard';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const XP_SOURCES = [
  { icon: '⧉', label: 'Flashcard set complete',         xp: '+10 XP' },
  { icon: '⧉', label: 'Flashcard set — perfect score',  xp: '+15 XP', perfect: true },
  { icon: '가', label: 'Hangul session done',            xp: '+10 XP' },
  { icon: '💬', label: 'Shadowing dialogue done',        xp: '+10 XP' },
  { icon: '≡',  label: 'Reading passage + quiz done',    xp: '+10 XP' },
  { icon: '≡',  label: 'Reading passage — perfect quiz', xp: '+15 XP', perfect: true },
];

type GoalDraft = { flashcards: number; reading: number; speaking: number; grammar: number };

function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <button onClick={() => onChange(Math.max(1, value - 1))}
        className="w-8 h-8 rounded-full border-[1.5px] border-border bg-cream font-bold text-ink text-lg flex items-center justify-center hover:border-ink transition-colors">−</button>
      <span className="text-base font-extrabold text-ink w-6 text-center">{value}</span>
      <button onClick={() => onChange(Math.min(99, value + 1))}
        className="w-8 h-8 rounded-full border-[1.5px] border-border bg-cream font-bold text-ink text-lg flex items-center justify-center hover:border-ink transition-colors">+</button>
    </div>
  );
}

export default function HomePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { stats } = useUserStats();
  const randomCard = useRandomCard();

  const [cardFlipped, setCardFlipped] = useState(false);
  const [showXpModal, setShowXpModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalDraft, setGoalDraft] = useState<GoalDraft>({ flashcards: 5, reading: 3, speaking: 4, grammar: 5 });
  const [savingGoal, setSavingGoal] = useState(false);

  const displayName = profile?.display_name || profile?.username || 'Learner';
  const goals = profile?.goals ?? null;

  // Progress = current stat minus baseline (snapshot at goal-set time)
  const goalRows = goals ? [
    {
      key: 'flashcards',
      label: 'Vocabulary cards',
      icon: '⧉',
      color: '#E8412C',
      done: Math.max(0, stats.cardsKnown    - (goals.baseline?.flashcards ?? 0)),
      target: goals.flashcards,
    },
    {
      key: 'reading',
      label: 'Reading passages',
      icon: '≡',
      color: '#3B82F6',
      done: Math.max(0, stats.passagesDone  - (goals.baseline?.reading ?? 0)),
      target: goals.reading,
    },
    {
      key: 'speaking',
      label: 'Speaking sessions',
      icon: '💬',
      color: '#8B5CF6',
      done: Math.max(0, stats.dialogueSessions - (goals.baseline?.speaking ?? 0)),
      target: goals.speaking,
    },
    {
      key: 'grammar',
      label: 'Grammar lessons',
      icon: '문',
      color: '#F59E0B',
      done: Math.max(0, stats.grammarDone   - (goals.baseline?.grammar ?? 0)),
      target: goals.grammar,
    },
  ] : [];

  const allGoalsMet = goalRows.length > 0 && goalRows.every(g => g.done >= g.target);

  const handleSaveGoal = async () => {
    if (!user) return;
    setSavingGoal(true);
    await updateDoc(doc(db, 'profiles', user.uid), {
      goals: {
        ...goalDraft,
        set_at: new Date().toISOString(),
        baseline: {
          flashcards: stats.cardsKnown,
          reading:    stats.passagesDone,
          speaking:   stats.dialogueSessions,
          grammar:    stats.grammarDone,
        },
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
    if (goals) setGoalDraft({ flashcards: goals.flashcards, reading: goals.reading, speaking: goals.speaking, grammar: goals.grammar });
    setShowGoalModal(true);
  };

  return (
    <div className="max-w-xl mx-auto px-7 py-8">

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs text-muted font-medium mb-1">안녕!</p>
          <h1 className="text-3xl font-extrabold text-ink">{displayName}</h1>
        </div>
        <div className="bg-navy rounded-2xl px-4 py-2.5 text-center min-w-[64px]">
          <p className="text-[11px] tracking-widest mb-0.5" style={{ color: '#888' }}>LEVEL</p>
          <p className="text-cream font-extrabold text-2xl leading-none">{stats.level}</p>
        </div>
      </div>

      {/* ── XP Bar ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border p-4 mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base">⚡</span>
            <span className="text-sm font-bold text-ink">Level {stats.level}</span>
            <span className="text-[11px] text-muted">→ Level {stats.level + 1}</span>
          </div>
          <span className="text-[11px] text-muted">{stats.xpIntoLevel} / {stats.xpNeeded} XP</span>
        </div>
        <div className="rounded-full overflow-hidden mb-2" style={{ background: '#F7F4EE', height: 10 }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.round(stats.xpProgress * 100)}%`, background: '#1A1F36' }} />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted">{stats.xpNeeded - stats.xpIntoLevel} XP to level up</p>
          <button onClick={() => setShowXpModal(true)}
            className="flex items-center gap-1 text-[11px] text-muted hover:text-ink transition-colors">
            How XP is earned
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-muted text-[9px]">?</span>
          </button>
        </div>
      </div>

      {/* ── Overview ──────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border p-4 mb-6">
        <p className="text-[11px] font-bold text-muted tracking-widest mb-3">OVERVIEW</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-cream rounded-xl p-3">
            <p className="text-[10px] font-bold text-muted tracking-wider mb-1">VOCAB</p>
            <p className="text-xl font-extrabold text-ink mb-0.5">
              {stats.cardsKnown}<span className="text-xs font-semibold text-muted"> / {stats.totalCards}</span>
            </p>
            <p className="text-[10px] text-muted mb-2">cards known</p>
            <ProgressBar progress={stats.totalCards > 0 ? stats.cardsKnown / stats.totalCards : 0} color="#E8412C" />
          </div>
          <div className="bg-cream rounded-xl p-3">
            <p className="text-[10px] font-bold text-muted tracking-wider mb-1">READING</p>
            <p className="text-xl font-extrabold text-ink mb-0.5">
              {stats.passagesDone}<span className="text-xs font-semibold text-muted"> / {stats.totalPassages}</span>
            </p>
            <p className="text-[10px] text-muted mb-2">passages done</p>
            <ProgressBar progress={stats.totalPassages > 0 ? stats.passagesDone / stats.totalPassages : 0} color="#3B82F6" />
          </div>
          <div className="bg-cream rounded-xl p-3">
            <p className="text-[10px] font-bold text-muted tracking-wider mb-1">SPEAK</p>
            <p className="text-xl font-extrabold text-ink mb-0.5">
              {stats.dialoguesDone}<span className="text-xs font-semibold text-muted"> / {stats.totalDialogues}</span>
            </p>
            <p className="text-[10px] text-muted mb-2">dialogues done</p>
            <ProgressBar progress={stats.totalDialogues > 0 ? stats.dialoguesDone / stats.totalDialogues : 0} color="#8B5CF6" />
          </div>
          <div className="bg-cream rounded-xl p-3">
            <p className="text-[10px] font-bold text-muted tracking-wider mb-1">GRAMMAR</p>
            <p className="text-xl font-extrabold text-ink mb-0.5">
              {stats.grammarDone}<span className="text-xs font-semibold text-muted"> / {stats.totalGrammar}</span>
            </p>
            <p className="text-[10px] text-muted mb-2">lessons done</p>
            <ProgressBar progress={stats.totalGrammar > 0 ? stats.grammarDone / stats.totalGrammar : 0} color="#F59E0B" />
          </div>
        </div>
      </div>

      {/* ── Goals ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold text-muted tracking-widest">GOALS</p>
          {goals && !allGoalsMet && (
            <button onClick={openEditGoal}
              className="text-[11px] font-semibold text-muted hover:text-ink transition-colors">Edit</button>
          )}
        </div>

        {!goals ? (
          <div className="flex flex-col items-center py-4 gap-3">
            <p className="text-sm text-muted text-center">No goals set yet. Set a target to track your progress.</p>
            <button onClick={() => setShowGoalModal(true)}
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-cream hover:opacity-90 transition-opacity"
              style={{ background: '#1A1F36' }}>
              Set a goal →
            </button>
          </div>
        ) : allGoalsMet ? (
          <div className="flex flex-col items-center py-4 gap-3">
            <p className="text-2xl">🎉</p>
            <p className="text-base font-extrabold text-ink">You've met your goal!</p>
            <p className="text-xs text-muted text-center">Amazing work. Reset to set a new challenge.</p>
            <button onClick={handleResetGoal}
              className="px-5 py-2.5 rounded-xl border-[1.5px] border-border font-bold text-sm text-ink hover:bg-cream transition-colors">
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
                      <p className={`text-xs font-bold transition-all ${met ? 'line-through text-muted' : 'text-ink'}`}>
                        {g.label}
                      </p>
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

      {/* ── Quick Practice ────────────────────────────────────── */}
      {randomCard && (
        <div className="mb-8">
          <p className="text-[14px] font-bold text-muted tracking-widest mb-2">Quick Practice</p>
          <FlipCard
            height={130}
            flipped={cardFlipped}
            onFlip={() => setCardFlipped(!cardFlipped)}
            front={
              <div className="h-full bg-navy rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer">
                <p className="text-[10px] text-gray-500 tracking-widest mb-3">TAP TO REVEAL</p>
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
                style={{ boxShadow: 'inset 0 0 0 2px #1A1F36' }}>
                <p className="text-[10px] text-muted tracking-widest mb-2">TRANSLATION</p>
                <p className="text-lg font-bold text-ink text-center">{randomCard.translation}</p>
              </div>
            }
          />
        </div>
      )}

      {/* ── Goal Modal ────────────────────────────────────────── */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={() => setShowGoalModal(false)}>
          <div className="bg-white w-full max-w-sm rounded-3xl p-6"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-base font-extrabold text-ink">Set your goal</p>
              <button onClick={() => setShowGoalModal(false)}
                className="w-7 h-7 rounded-full bg-cream flex items-center justify-center text-muted hover:text-ink text-sm">✕</button>
            </div>
            <p className="text-xs text-muted mb-5">Progress counts from when you save this goal.</p>
            <div className="flex flex-col gap-4 mb-6">
              {[
                { key: 'flashcards', label: 'Vocabulary cards',   icon: '⧉' },
                { key: 'reading',    label: 'Reading passages', icon: '≡' },
                { key: 'speaking',   label: 'Speaking sessions',        icon: '💬' },
                { key: 'grammar',    label: 'Grammar lessons',  icon: '문' },
              ].map(({ key, label, icon }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base w-5 text-center">{icon}</span>
                    <span className="text-sm font-semibold text-ink">{label}</span>
                  </div>
                  <Stepper
                    value={goalDraft[key as keyof GoalDraft]}
                    onChange={v => setGoalDraft(prev => ({ ...prev, [key]: v }))}
                  />
                </div>
              ))}
            </div>
            <button onClick={handleSaveGoal} disabled={savingGoal}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-cream disabled:opacity-40 hover:opacity-90 transition-opacity"
              style={{ background: '#1A1F36' }}>
              {savingGoal ? 'Saving...' : 'Save Goal'}
            </button>
          </div>
        </div>
      )}

      {/* ── XP Modal ─────────────────────────────────────────── */}
      {showXpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={() => setShowXpModal(false)}>
          <div className="bg-white w-full max-w-[500px] rounded-3xl p-6 pb-8 mx-4"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-base font-extrabold text-ink">How XP is earned</p>
              <button onClick={() => setShowXpModal(false)}
                className="w-7 h-7 rounded-full bg-cream flex items-center justify-center text-muted hover:text-ink text-sm">✕</button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border">
              {XP_SOURCES.map((s, i) => (
                <div key={i}
                  className={`flex items-center justify-between px-4 py-3 ${i < XP_SOURCES.length - 1 ? 'border-b border-border' : ''} ${i % 2 === 0 ? 'bg-white' : 'bg-cream'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-base w-5 text-center">{s.icon}</span>
                    <span className="text-sm text-ink">{s.label}</span>
                    {s.perfect && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                        style={{ background: '#FDE8E4', color: '#E8412C' }}>perfect</span>
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
