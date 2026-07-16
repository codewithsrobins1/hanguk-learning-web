'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useUserStats } from '@/hooks/useUserStats';
import { useGrammarLessons, useMilestoneResults } from '@/hooks/useGrammar';
import { useFlashcardSets } from '@/hooks/useFlashcards';
import { usePassages } from '@/hooks/usePassages';
import { useDialogues } from '@/hooks/useShadowing';
import { useListeningExercises } from '@/hooks/useListening';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Priority, Routine, KoreanLevel,
  buildRoutine, getTodayPlan, getBlocksForDayType, dayTypeLabel,
  selectedDaysLabel, sanitizeDays, sanitizeMinutes,
  getUpcomingDays, dayTypeShortLabel, dayTypeIcon,
} from '@/lib/routine';

const MINUTE_PRESETS = [15, 30, 60];
const PRIORITY_OPTIONS: { value: Priority; label: string; icon: string }[] = [
  { value: 'balanced',          label: 'Balanced',            icon: '⚖️' },
  { value: 'grammar',           label: 'Grammar',              icon: '문' },
  { value: 'vocab',             label: 'Vocabulary',           icon: '⧉' },
  { value: 'speaking',          label: 'Speaking',             icon: '💬' },
  { value: 'reading_listening', label: 'Reading & listening',  icon: '≡' },
];
const LEVEL_OPTIONS: { value: KoreanLevel; label: string; sub: string }[] = [
  { value: 'beginner',           label: 'Just starting',    sub: 'New to Korean' },
  { value: 'some_basics',        label: 'Some basics',      sub: 'Know Hangul and simple words' },
  { value: 'intermediate_plus',  label: 'Intermediate+',    sub: 'Comfortable with grammar basics' },
];
const WEEKDAYS = [
  { value: 0, short: 'S' }, { value: 1, short: 'M' }, { value: 2, short: 'T' },
  { value: 3, short: 'W' }, { value: 4, short: 'T' }, { value: 5, short: 'F' }, { value: 6, short: 'S' },
];

function Stepper({ value, onChange, min, max }: { value: number; onChange: (v: number) => void; min: number; max: number }) {
  return (
    <div className="flex items-center gap-3 justify-center">
      <button onClick={() => onChange(Math.max(min, value - 1))}
        className="w-9 h-9 rounded-full border-2 border-border bg-cream font-bold text-ink text-lg flex items-center justify-center hover:border-ink transition-colors">−</button>
      <span className="text-2xl font-quicksand font-bold text-ink w-14 text-center">{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))}
        className="w-9 h-9 rounded-full border-2 border-border bg-cream font-bold text-ink text-lg flex items-center justify-center hover:border-ink transition-colors">+</button>
    </div>
  );
}

function WeekdayPicker({ selected, onToggle }: { selected: number[]; onToggle: (d: number) => void }) {
  return (
    <div className="flex justify-center gap-2 mb-4">
      {WEEKDAYS.map(d => {
        const active = selected.includes(d.value);
        return (
          <button key={d.value} onClick={() => onToggle(d.value)}
            className="w-10 h-10 rounded-full text-sm font-bold transition-all flex items-center justify-center"
            style={{
              background: active ? '#1A1F36' : '#F7F4EE',
              color: active ? '#F7F4EE' : '#888',
              border: '2px solid', borderColor: active ? '#1A1F36' : '#E8E3D8',
            }}>
            {d.short}
          </button>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { stats } = useUserStats();

  const { lessons, loading: lessonsLoading }     = useGrammarLessons();
  const { results: milestoneResults } = useMilestoneResults();
  const { sets, loading: setsLoading }           = useFlashcardSets();
  const { passages, loading: passagesLoading }   = usePassages();
  const { dialogues, loading: dialoguesLoading }  = useDialogues();
  const { exercises, loading: exercisesLoading }  = useListeningExercises();

  const router = useRouter();
  const routine: Routine | null = (profile?.routine as Routine | undefined) ?? null;

  // ── Onboarding state ───────────────────────────────────────────
  const [step, setStep] = useState(0);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 3, 5]); // default Mon/Wed/Fri
  const [minutes, setMinutes] = useState(30);
  const [priority, setPriority] = useState<Priority>('balanced');
  const [level, setLevel] = useState<KoreanLevel>('beginner');
  const [showMinCustom, setShowMinCustom] = useState(false);
  const [minCustomInput, setMinCustomInput] = useState('');
  const [saving, setSaving] = useState(false);

  // ── Settings modal state ───────────────────────────────────────
  const [showSettings, setShowSettings] = useState(false);
  const [editDays, setEditDays]         = useState<number[]>([1, 3, 5]);
  const [editMinutes, setEditMinutes]   = useState(30);
  const [editPriority, setEditPriority] = useState<Priority>('balanced');
  const [editLevel, setEditLevel]       = useState<KoreanLevel>('beginner');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // ── Manual checkbox state — local only, resets each new day ────
  // Key: `${todayDateString}_${blockIndex}`
  const todayKey = new Date().toISOString().split('T')[0];
  const [manualChecks, setManualChecks] = useState<Record<string, boolean>>({});

  // ── Today's plan ────────────────────────────────────────────────
  const { dayType, cycleDay } = useMemo(() => {
    if (!routine) return { dayType: null, cycleDay: 0 };
    return getTodayPlan(routine as Routine);
  }, [routine]);

  const blocks = useMemo(() => {
    if (!dayType || !routine) return [];
    return getBlocksForDayType(dayType, routine.minutesPerDay);
  }, [dayType, routine]);

  const upcomingDays = useMemo(() => {
    if (!routine) return [];
    return getUpcomingDays(routine, 7);
  }, [routine]);

  const resolvedBlocks = useMemo(() => {
    return blocks.map(block => {
      let target: { label: string; href: string; autoDone: boolean } | null = null;

      if (block.kind === 'grammar_lesson') {
        if (lessonsLoading) { target = null; }
        else if (block.variant === 'review') {
          const completedLessons = lessons.filter(l => l.completed_at);
          const reviewLesson = completedLessons[completedLessons.length - 1]; // most recently completed
          target = reviewLesson
            ? { label: `${reviewLesson.title_en} (${reviewLesson.title_ko})`, href: `/grammar/${reviewLesson.id}`, autoDone: false }
            : { label: 'No lessons to review yet — try a new one first', href: '/grammar', autoDone: false };
        } else {
          const next = lessons.find(l => !l.completed_at);
          target = next
            ? { label: `${next.title_en} (${next.title_ko})`, href: `/grammar/${next.id}`, autoDone: false }
            : { label: 'All grammar lessons completed!', href: '/grammar', autoDone: true };
        }
      }

      if (block.kind === 'grammar_quiz') {
        if (lessonsLoading) { target = null; }
        else {
          const prefixMap: Record<string, string> = { Beginner: 'beg', Intermediate: 'int', Advanced: 'adv' };
          let foundMilestone: string | null = null;
          for (const lvl of ['Beginner', 'Intermediate', 'Advanced'] as const) {
            const levelLessons = lessons.filter(l => l.level === lvl);
            const groupCount = Math.ceil(levelLessons.length / 5);
            for (let g = 1; g <= groupCount; g++) {
              const id = `milestone_${prefixMap[lvl]}_${g}`;
              const groupLessons = levelLessons.slice((g - 1) * 5, g * 5);
              const allDone = groupLessons.length > 0 && groupLessons.every(l => l.completed_at);
              const passed = milestoneResults[id]?.passed;
              if (allDone && !passed) { foundMilestone = id; break; }
            }
            if (foundMilestone) break;
          }
          target = foundMilestone
            ? { label: 'Grammar checkpoint quiz', href: `/grammar/milestone/${foundMilestone}`, autoDone: false }
            : { label: 'Review a grammar lesson', href: '/grammar', autoDone: false };
        }
      }

      if (block.kind === 'flashcards') {
        if (setsLoading) { target = null; }
        else if (block.variant === 'review') {
          const masteredSet = sets.find(s => s.card_count > 0 && (s.mastery_count ?? 0) >= s.card_count);
          target = masteredSet
            ? { label: masteredSet.title, href: `/cards/${masteredSet.id}`, autoDone: false }
            : { label: 'Nothing to review yet — study a new set first', href: '/cards', autoDone: false };
        } else {
          const next = sets.find(s => (s.mastery_count ?? 0) < s.card_count);
          target = next
            ? { label: next.title, href: `/cards/${next.id}`, autoDone: false }
            : { label: 'All flashcard sets mastered!', href: '/cards', autoDone: true };
        }
      }

      if (block.kind === 'shadow') {
        if (dialoguesLoading) { target = null; }
        else {
          const next = dialogues.find(d => !d.completed_at);
          target = next
            ? { label: next.title, href: `/shadow/${next.id}`, autoDone: false }
            : { label: 'All dialogues completed!', href: '/shadow', autoDone: true };
        }
      }

      if (block.kind === 'read') {
        if (passagesLoading) { target = null; }
        else {
          const next = passages.find(p => !p.done);
          target = next
            ? { label: next.title_en || next.title, href: `/read/${next.id}`, autoDone: false }
            : { label: 'All passages completed!', href: '/read', autoDone: true };
        }
      }

      if (block.kind === 'listen') {
        if (exercisesLoading) { target = null; }
        else {
          const next = exercises.find(e => !e.completed_at);
          target = next
            ? { label: next.title, href: `/listen/${next.id}`, autoDone: false }
            : { label: 'All listening exercises completed!', href: '/listen', autoDone: true };
        }
      }

      return { ...block, target };
    });
  }, [blocks, lessons, milestoneResults, sets, passages, dialogues, exercises]);

  const isChecked = (i: number) => manualChecks[`${todayKey}_${i}`] ?? (resolvedBlocks[i]?.target?.autoDone ?? false);
  const toggleCheck = (i: number) => {
    const key = `${todayKey}_${i}`;
    setManualChecks(prev => ({ ...prev, [key]: !isChecked(i) }));
  };

  const doneCount = resolvedBlocks.filter((_, i) => isChecked(i)).length;
  const allDone   = resolvedBlocks.length > 0 && doneCount === resolvedBlocks.length;

  // ── Onboarding handlers ─────────────────────────────────────────
  const toggleOnboardDay = (d: number) => {
    setSelectedDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort());
  };

  const handleMinCustomSubmit = () => {
    const n = sanitizeMinutes(minCustomInput);
    if (n !== null) { setMinutes(n); setShowMinCustom(false); setMinCustomInput(''); }
  };

  const handleFinishOnboarding = async () => {
    if (!user || selectedDays.length === 0) return;
    setSaving(true);
    const newRoutine = buildRoutine(selectedDays, minutes, priority, level);
    await updateDoc(doc(db, 'profiles', user.uid), { routine: newRoutine });
    await refreshProfile();
    setSaving(false);
  };

  // ── Settings handlers ───────────────────────────────────────────
  const openSettings = () => {
    if (routine) {
      setEditDays(routine.selectedDays);
      setEditMinutes(routine.minutesPerDay);
      setEditPriority(routine.priority as Priority);
      setEditLevel((routine as any).level ?? 'beginner');
    }
    setShowSettings(true);
  };

  const toggleEditDay = (d: number) => {
    setEditDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort());
  };

  const handleConfirmSettings = async () => {
    if (!user || editDays.length === 0) return;
    const updated = buildRoutine(editDays, editMinutes, editPriority, editLevel);
    await updateDoc(doc(db, 'profiles', user.uid), { routine: updated });
    await refreshProfile();
    setShowSettings(false);
  };

  const handleResetRoutine = async () => {
    if (!user) return;
    await updateDoc(doc(db, 'profiles', user.uid), { routine: null });
    await refreshProfile();
    setShowResetConfirm(false);
    setShowSettings(false);
    setStep(0);
  };

  const displayName = profile?.display_name || profile?.username || 'Learner';

  // ════════════════════════════════════════════════════════════════
  // ── ONBOARDING FLOW ──────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════
  if (!routine) {
    const TOTAL_STEPS = 4;

    return (
      <div className="max-w-xl mx-auto px-6 py-10">
        {step === 0 && (
          <div className="flex flex-col items-center text-center py-10">
            <div className="w-16 h-16 bg-navy rounded-3xl flex items-center justify-center mb-5">
              <span className="text-cream text-2xl font-bold" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>한</span>
            </div>
            <h1 className="font-quicksand font-bold text-ink text-3xl mb-2">Build your routine</h1>
            <p className="text-sm text-muted mb-8 max-w-xs">
              Answer a few quick questions and we'll build a daily plan you can actually stick to.
            </p>
            <button onClick={() => setStep(1)}
              className="btn-press bg-navy text-cream px-8 py-4 rounded-2xl font-quicksand font-bold text-base">
              Build Routine →
            </button>
          </div>
        )}

        {step >= 1 && step <= TOTAL_STEPS && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted">Question {step} of {TOTAL_STEPS}</span>
              <button onClick={() => setStep(0)} className="text-muted hover:text-ink text-lg">✕</button>
            </div>
            <div className="rounded-full overflow-hidden mb-8" style={{ background: '#E8E3D8', height: 5 }}>
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(step / TOTAL_STEPS) * 100}%`, background: '#E8412C' }} />
            </div>

            {/* Step 1: Which days */}
            {step === 1 && (
              <div className="bg-white rounded-3xl border-2 border-border p-7">
                <h2 className="font-quicksand font-bold text-ink text-xl mb-1">Which days do you want to study?</h2>
                <p className="text-sm text-muted mb-6">Tap the days that work for your schedule.</p>

                <WeekdayPicker selected={selectedDays} onToggle={toggleOnboardDay} />

                <p className="text-center text-sm font-semibold text-ink mb-5">
                  {selectedDays.length === 0 ? 'Select at least 1 day' : `${selectedDays.length} day${selectedDays.length > 1 ? 's' : ''}/week · ${selectedDaysLabel(selectedDays)}`}
                </p>

                <button onClick={() => setStep(2)} disabled={selectedDays.length === 0}
                  className="btn-press w-full bg-navy text-cream py-4 rounded-2xl font-quicksand font-bold text-base disabled:opacity-40">
                  Continue →
                </button>
              </div>
            )}

            {/* Step 2: Minutes per day */}
            {step === 2 && (
              <div className="bg-white rounded-3xl border-2 border-border p-7">
                <h2 className="font-quicksand font-bold text-ink text-xl mb-1">How long per day do you plan on studying?</h2>
                <p className="text-sm text-muted mb-6">We'll split your time across a few activities.</p>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  {MINUTE_PRESETS.map(m => (
                    <button key={m} onClick={() => { setMinutes(m); setShowMinCustom(false); }}
                      className="py-3 rounded-xl text-sm font-bold transition-all"
                      style={{
                        background: minutes === m && !showMinCustom ? '#1A1F36' : '#F7F4EE',
                        color: minutes === m && !showMinCustom ? '#F7F4EE' : '#444',
                        border: '2px solid', borderColor: minutes === m && !showMinCustom ? '#1A1F36' : '#E8E3D8',
                      }}>
                      {m} min
                    </button>
                  ))}
                  <button onClick={() => setShowMinCustom(true)}
                    className="py-3 rounded-xl text-sm font-bold transition-all"
                    style={{
                      background: showMinCustom ? '#1A1F36' : '#F7F4EE',
                      color: showMinCustom ? '#F7F4EE' : '#444',
                      border: '2px solid', borderColor: showMinCustom ? '#1A1F36' : '#E8E3D8',
                    }}>
                    Custom
                  </button>
                </div>

                {showMinCustom && (
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="text" inputMode="numeric" value={minCustomInput}
                      onChange={e => setMinCustomInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                      placeholder="5-180"
                      className="input-field flex-1" style={{ paddingLeft: 16 }}
                    />
                    <button onClick={handleMinCustomSubmit}
                      className="px-4 py-3 rounded-xl bg-navy text-cream font-bold text-sm">Set</button>
                  </div>
                )}

                <div className="flex items-center gap-2 bg-cream rounded-xl px-3 py-2.5 mb-6">
                  <span className="text-xs">ℹ️</span>
                  <span className="text-xs text-muted">Custom accepts numbers 5–180 only</span>
                </div>

                <p className="text-center text-sm font-semibold text-ink mb-5">Selected: {minutes} min/day</p>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-2xl border-2 border-border font-bold text-sm text-ink hover:bg-cream transition-colors">
                    ← Back
                  </button>
                  <button onClick={() => setStep(3)}
                    className="btn-press flex-1 bg-navy text-cream py-4 rounded-2xl font-quicksand font-bold text-base">
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Priority */}
            {step === 3 && (
              <div className="bg-white rounded-3xl border-2 border-border p-7">
                <h2 className="font-quicksand font-bold text-ink text-xl mb-1">What do you want to prioritize?</h2>
                <p className="text-sm text-muted mb-6">We'll weight your routine toward this — but still cover everything.</p>

                <div className="flex flex-col gap-2 mb-6">
                  {PRIORITY_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => setPriority(opt.value)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all text-left"
                      style={{
                        background: priority === opt.value ? '#1A1F36' : '#F7F4EE',
                        color: priority === opt.value ? '#F7F4EE' : '#444',
                        border: '2px solid', borderColor: priority === opt.value ? '#1A1F36' : '#E8E3D8',
                      }}>
                      <span className="text-base w-5 text-center">{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)}
                    className="flex-1 py-4 rounded-2xl border-2 border-border font-bold text-sm text-ink hover:bg-cream transition-colors">
                    ← Back
                  </button>
                  <button onClick={() => setStep(4)}
                    className="btn-press flex-1 bg-navy text-cream py-4 rounded-2xl font-quicksand font-bold text-base">
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Korean level */}
            {step === 4 && (
              <div className="bg-white rounded-3xl border-2 border-border p-7">
                <h2 className="font-quicksand font-bold text-ink text-xl mb-1">How would you describe your Korean level?</h2>
                <p className="text-sm text-muted mb-6">This just helps us understand where you're starting from.</p>

                <div className="flex flex-col gap-2 mb-6">
                  {LEVEL_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => setLevel(opt.value)}
                      className="flex flex-col items-start gap-0.5 px-4 py-3.5 rounded-xl transition-all text-left"
                      style={{
                        background: level === opt.value ? '#1A1F36' : '#F7F4EE',
                        border: '2px solid', borderColor: level === opt.value ? '#1A1F36' : '#E8E3D8',
                      }}>
                      <span className="text-sm font-bold" style={{ color: level === opt.value ? '#F7F4EE' : '#444' }}>{opt.label}</span>
                      <span className="text-xs" style={{ color: level === opt.value ? 'rgba(255,255,255,0.5)' : '#888' }}>{opt.sub}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(3)}
                    className="flex-1 py-4 rounded-2xl border-2 border-border font-bold text-sm text-ink hover:bg-cream transition-colors">
                    ← Back
                  </button>
                  <button onClick={handleFinishOnboarding} disabled={saving}
                    className="btn-press-red flex-1 bg-red text-white py-4 rounded-2xl font-quicksand font-bold text-base disabled:opacity-50">
                    {saving ? 'Building...' : 'Build My Routine →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // ── TODAY'S PLAN (routine exists) ───────────────────────────────
  // ════════════════════════════════════════════════════════════════
  return (
    <div className="max-w-xl lg:max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-muted font-medium mb-1">안녕하세요!</p>
          <h1 className="font-quicksand font-bold text-ink text-3xl">{displayName}</h1>
        </div>
        <div className="bg-navy rounded-2xl px-3.5 py-2 text-center min-w-[56px]">
          <p className="text-[9px] tracking-widest mb-0.5 font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>LVL</p>
          <p className="text-cream font-quicksand font-bold text-lg leading-none">{stats.level}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 lg:gap-6 lg:items-start">

        {/* ── Right column on desktop: XP bar + week strip ────── */}
        <div className="order-1 lg:order-2 flex flex-col gap-5">
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
            <div className="rounded-full overflow-hidden" style={{ background: '#F7F4EE', height: 10 }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.round(stats.xpProgress * 100)}%`, background: '#E8412C' }} />
            </div>
          </div>

          {/* Week ahead strip */}
          {upcomingDays.length > 0 && (
            <div className="grid w-full" style={{ gridTemplateColumns: `repeat(${upcomingDays.length}, minmax(0, 1fr))`, gap: 6 }}>
              {upcomingDays.map((d, i) => {
                const dayName = d.date.toLocaleDateString('en-US', { weekday: 'short' });
                return (
                  <div key={i}
                    className="flex flex-col items-center gap-1 rounded-2xl px-1 py-2.5 min-w-0"
                    style={{
                      background: d.isToday ? '#1A1F36' : '#fff',
                      border: d.isToday ? 'none' : '2px solid #E8E3D8',
                    }}>
                    <span className="text-[10px] font-bold truncate" style={{ color: d.isToday ? 'rgba(255,255,255,0.5)' : '#888' }}>
                      {d.isToday ? 'TODAY' : dayName}
                    </span>
                    <span className="text-sm" style={{ opacity: d.dayType ? 1 : 0.4 }}>{dayTypeIcon(d.dayType)}</span>
                    <span className="text-[9px] font-semibold text-center leading-tight truncate w-full"
                      style={{ color: d.isToday ? '#F7F4EE' : d.dayType ? '#444' : '#bbb' }}>
                      {dayTypeShortLabel(d.dayType)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Left column on desktop: Today's Plan ────────────── */}
        <div className="order-2 lg:order-1">
          {/* No study day (rest day) */}
          {!dayType ? (
            <div className="bg-white rounded-3xl border-2 border-border p-8 text-center">
              <p className="text-3xl mb-3">😌</p>
              <p className="font-quicksand font-bold text-ink text-xl mb-1">No routine day today</p>
              <p className="text-sm text-muted mb-5">Today's a rest day in your schedule. Feel free to practice anyway!</p>
              <button onClick={openSettings}
                className="text-xs font-semibold text-muted hover:text-ink transition-colors underline">
                See routine settings
              </button>
            </div>
          ) : (
            /* ── Single bordered card: navy header + checklist + footer ── */
            <div className="rounded-3xl overflow-hidden" style={{ border: '2px solid #E8E3D8' }}>

              {/* Navy header */}
              <div className="bg-navy px-6 py-5">
                {allDone ? (
                  <>
                    <p className="text-[11px] text-white/40 font-semibold mb-1">TODAY · DAY {cycleDay} OF ROUTINE</p>
                    <p className="font-quicksand font-bold text-cream text-2xl mb-1">🎉 Plan complete!</p>
                    <p className="text-xs text-white/40">{doneCount} of {resolvedBlocks.length} activities done · nice work</p>
                  </>
                ) : (
                  <>
                    <p className="text-[11px] text-white/40 font-semibold mb-1">TODAY · DAY {cycleDay} OF ROUTINE</p>
                    <p className="font-quicksand font-bold text-cream text-2xl mb-2">{dayTypeLabel(dayType)}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-white/40 text-xs">⏱</span>
                      <span className="text-xs text-white/40">{routine.minutesPerDay} min planned</span>
                    </div>
                  </>
                )}
              </div>

              {/* Checklist */}
              <div className="bg-cream p-4 flex flex-col gap-2.5">
                {resolvedBlocks.map((b, i) => {
                  const checked = isChecked(i);
                  const isLoading = b.target === null;
                  return (
                    <div key={i}
                      className="w-full bg-white rounded-2xl p-3.5 flex items-center gap-3 transition-all"
                      style={{ border: checked ? '2px solid #86EFAC' : '2px solid #E8E3D8', opacity: isLoading ? 0.5 : 1 }}>

                      {/* Step number */}
                      <span className="text-xs font-bold text-muted w-4 flex-shrink-0 text-center">{i + 1}</span>

                      {/* Checkbox */}
                      <button onClick={() => !isLoading && toggleCheck(i)} aria-label="Mark complete" disabled={isLoading}
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                        style={{
                          background: checked ? '#16A34A' : '#fff',
                          border: checked ? 'none' : '2px solid #C4BFBA',
                        }}>
                        {checked && <span className="text-white text-sm font-bold">✓</span>}
                      </button>

                      {/* Tappable label — navigates */}
                      <button onClick={() => b.target && router.push(b.target.href)} disabled={isLoading} className="flex-1 min-w-0 text-left">
                        <p className={`text-sm font-bold ${checked ? 'line-through text-muted' : 'text-ink'}`}>{b.label}</p>
                        <p className={`text-xs truncate ${checked ? 'line-through text-muted' : 'text-muted'}`}>
                          {isLoading ? 'Loading...' : `${b.minutes} min · Tap to open`}
                        </p>
                      </button>

                      <button onClick={() => b.target && router.push(b.target.href)} disabled={isLoading} aria-label="Go to activity">
                        <span className="text-muted text-base flex-shrink-0">→</span>
                      </button>
                    </div>
                  );
                })}

                {/* Footer */}
                <div className="flex items-center justify-between pt-1.5">
                  <span className="text-xs text-muted">{doneCount} of {resolvedBlocks.length} done</span>
                  <button onClick={openSettings}
                    className="text-xs font-semibold text-muted hover:text-ink transition-colors underline">
                    See routine settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Settings modal ─────────────────────────────────────── */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowSettings(false)}>
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <p className="font-quicksand font-bold text-ink text-lg">Routine settings</p>
              <button onClick={() => setShowSettings(false)}
                className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-muted hover:text-ink text-sm">✕</button>
            </div>

            <p className="text-xs font-bold text-muted tracking-widest mb-3">STUDY DAYS</p>
            <WeekdayPicker selected={editDays} onToggle={toggleEditDay} />
            <p className="text-center text-xs text-muted mb-5">
              {editDays.length === 0 ? 'Select at least 1 day' : `${editDays.length} day${editDays.length > 1 ? 's' : ''}/week · ${selectedDaysLabel(editDays)}`}
            </p>

            <p className="text-xs font-bold text-muted tracking-widest mb-2">MINUTES PER DAY</p>
            <Stepper value={editMinutes} onChange={setEditMinutes} min={5} max={180} />
            <p className="text-center text-xs text-muted mt-2 mb-5">{editMinutes} minutes per session</p>

            <p className="text-xs font-bold text-muted tracking-widest mb-2">PRIORITY FOCUS</p>
            <select value={editPriority} onChange={e => setEditPriority(e.target.value as Priority)}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-cream text-sm font-bold text-ink outline-none mb-5">
              {PRIORITY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>

            <p className="text-xs font-bold text-muted tracking-widest mb-2">KOREAN LEVEL</p>
            <select value={editLevel} onChange={e => setEditLevel(e.target.value as KoreanLevel)}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-cream text-sm font-bold text-ink outline-none mb-5">
              {LEVEL_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>

            <div className="flex items-start gap-2 bg-cream rounded-xl px-3 py-2.5 mb-5">
              <span className="text-xs">⚠️</span>
              <span className="text-xs text-muted">Saving changes rebuilds your routine cycle starting today.</span>
            </div>

            <button onClick={handleConfirmSettings} disabled={editDays.length === 0}
              className="btn-press-red w-full bg-red text-white py-3.5 rounded-2xl font-quicksand font-bold text-sm mb-2 disabled:opacity-40">
              Confirm changes
            </button>
            <button onClick={() => setShowResetConfirm(true)}
              className="w-full py-3 rounded-2xl text-sm font-semibold text-red hover:bg-redLight transition-colors mb-1">
              Reset routine
            </button>
            <button onClick={() => setShowSettings(false)}
              className="w-full py-2 text-xs text-muted">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Reset confirmation ─────────────────────────────────── */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => setShowResetConfirm(false)}>
          <div className="bg-white w-full max-w-sm rounded-3xl p-6" onClick={e => e.stopPropagation()}>
            <p className="text-3xl mb-3 text-center">⚠️</p>
            <p className="font-quicksand font-bold text-ink text-lg text-center mb-2">Reset your routine?</p>
            <p className="text-sm text-muted text-center mb-6">
              This will delete your current routine completely. You'll go through the setup questions again from scratch.
            </p>
            <button onClick={handleResetRoutine}
              className="btn-press-red w-full bg-red text-white py-3.5 rounded-2xl font-quicksand font-bold text-sm mb-2">
              Yes, reset my routine
            </button>
            <button onClick={() => setShowResetConfirm(false)}
              className="w-full py-3 rounded-2xl border-2 border-border font-bold text-sm text-ink hover:bg-cream transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
