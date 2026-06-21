// ── Routine engine ──────────────────────────────────────────────
// Central config: day-type rotations per priority, and the blocks
// (activities) that make up each day-type. Add a new priority or
// day-type here — nothing else needs to change.

export type Priority   = 'balanced' | 'grammar' | 'vocab' | 'speaking' | 'reading_listening';
export type DayType    = 'grammar' | 'vocab' | 'speaking' | 'reading_listening';
export type BlockKind  = 'grammar_lesson' | 'grammar_quiz' | 'flashcards' | 'shadow' | 'read' | 'listen';
export type KoreanLevel = 'beginner' | 'some_basics' | 'intermediate_plus';

export type RoutineBlock = {
  kind:       BlockKind;
  label:      string;
  weight:     number;
  minMinutes: number;
  variant?:   'new' | 'review'; // distinguishes duplicate kinds, default 'new'
};

export type Routine = {
  daysPerWeek:   number;
  minutesPerDay: number;
  priority:      Priority;
  level:         KoreanLevel;
  selectedDays:  number[];   // 0=Sun .. 6=Sat
  cycle:         DayType[];
  created_at:    string;
};

// ── Day-type rotations per priority ─────────────────────────────
const CYCLES: Record<Priority, DayType[]> = {
  balanced:          ['grammar', 'vocab', 'speaking', 'reading_listening'],
  grammar:           ['grammar', 'vocab', 'grammar', 'speaking', 'grammar', 'reading_listening'],
  vocab:             ['vocab', 'grammar', 'vocab', 'speaking', 'vocab', 'reading_listening'],
  speaking:          ['speaking', 'grammar', 'speaking', 'vocab', 'speaking', 'reading_listening'],
  reading_listening: ['reading_listening', 'grammar', 'reading_listening', 'vocab', 'reading_listening', 'speaking'],
};

// ── Blocks per day-type — ordered by importance, first = most essential.
// Trimming logic includes blocks left-to-right only while each included
// block can still get at least its minMinutes once time is split. ──────
const BLOCKS: Record<DayType, RoutineBlock[]> = {
  grammar: [
    { kind: 'grammar_lesson', label: 'Learn a new grammar point', weight: 0.34, minMinutes: 10 },
    { kind: 'grammar_quiz',   label: 'Practice grammar',          weight: 0.24, minMinutes: 8  },
    { kind: 'shadow',         label: 'Watch & shadow examples',   weight: 0.24, minMinutes: 8  },
    { kind: 'flashcards',     label: 'Review vocab in context',   weight: 0.18, minMinutes: 8, variant: 'review' },
  ],
  vocab: [
    { kind: 'flashcards', label: 'Study a new vocabulary set',      weight: 0.30, minMinutes: 10 },
    { kind: 'flashcards', label: 'Review previously learned cards', weight: 0.24, minMinutes: 8, variant: 'review' },
    { kind: 'read',       label: 'See vocab in context',            weight: 0.24, minMinutes: 8  },
    { kind: 'listen',     label: 'Listening exercise',              weight: 0.22, minMinutes: 8  },
  ],
  speaking: [
    { kind: 'shadow',     label: 'Shadow a dialogue',         weight: 0.32, minMinutes: 10 },
    { kind: 'listen',     label: 'Listening exercise',        weight: 0.24, minMinutes: 8  },
    { kind: 'flashcards', label: 'Review vocab for speaking', weight: 0.22, minMinutes: 8, variant: 'review' },
    { kind: 'read',       label: 'Read a passage',            weight: 0.22, minMinutes: 8  },
  ],
  reading_listening: [
    { kind: 'read',           label: 'Read a passage + quiz', weight: 0.32, minMinutes: 10 },
    { kind: 'listen',         label: 'Listening exercise',    weight: 0.24, minMinutes: 8  },
    { kind: 'grammar_lesson', label: 'Quick grammar review',  weight: 0.22, minMinutes: 8, variant: 'review' },
    { kind: 'flashcards',     label: 'Review vocab',          weight: 0.22, minMinutes: 8, variant: 'review' },
  ],
};

const DAY_LABELS: Record<DayType, string> = {
  grammar: 'Grammar day',
  vocab: 'Vocab day',
  speaking: 'Speaking day',
  reading_listening: 'Reading & listening day',
};

export function dayTypeLabel(d: DayType) { return DAY_LABELS[d]; }

export function dayTypeShortLabel(d: DayType | null): string {
  if (!d) return 'Rest';
  const labels: Record<DayType, string> = {
    grammar: 'Grammar', vocab: 'Vocab', speaking: 'Speak', reading_listening: 'Read',
  };
  return labels[d];
}

export function dayTypeIcon(d: DayType | null): string {
  if (!d) return '😌';
  const icons: Record<DayType, string> = {
    grammar: '문', vocab: '⧉', speaking: '💬', reading_listening: '≡',
  };
  return icons[d];
}

// ── Weekday helpers ──────────────────────────────────────────────
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export function selectedDaysLabel(days: number[]): string {
  return [...days].sort((a, b) => a - b).map(d => DAY_NAMES[d]).join(', ');
}

const SPREAD: Record<number, number[]> = {
  1: [3], 2: [1, 4], 3: [1, 3, 5], 4: [1, 2, 4, 5],
  5: [1, 2, 3, 4, 5], 6: [1, 2, 3, 4, 5, 6], 7: [0, 1, 2, 3, 4, 5, 6],
};
export function selectedDaysFor(daysPerWeek: number): number[] {
  return SPREAD[daysPerWeek] ?? SPREAD[7];
}

// ── Build a routine from onboarding answers ─────────────────────
export function buildRoutine(
  selectedDays: number[],
  minutesPerDay: number,
  priority: Priority,
  level: KoreanLevel
): Routine {
  return {
    daysPerWeek: selectedDays.length,
    minutesPerDay,
    priority,
    level,
    selectedDays: [...selectedDays].sort((a, b) => a - b),
    cycle: CYCLES[priority],
    created_at: new Date().toISOString(),
  };
}

// ── Determine today's day-type, or null if today is a rest day ──
export function getTodayPlan(routine: Routine): { dayType: DayType | null; cycleDay: number } {
  const today = new Date();
  const todayWeekday = today.getDay();

  if (!routine.selectedDays.includes(todayWeekday)) {
    return { dayType: null, cycleDay: 0 };
  }

  const created = new Date(routine.created_at);
  created.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  let activeDayCount = 0;
  const cursor = new Date(created);
  while (cursor <= now) {
    if (routine.selectedDays.includes(cursor.getDay())) activeDayCount++;
    cursor.setDate(cursor.getDate() + 1);
  }

  const cycleIndex = (activeDayCount - 1 + routine.cycle.length) % routine.cycle.length;
  return { dayType: routine.cycle[cycleIndex], cycleDay: activeDayCount };
}

// ── Preview upcoming days — for the "week ahead" strip ──────────
export function getUpcomingDays(routine: Routine, count: number = 7): { date: Date; dayType: DayType | null; isToday: boolean }[] {
  const result: { date: Date; dayType: DayType | null; isToday: boolean }[] = [];
  const created = new Date(routine.created_at);
  created.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let activeDayCount = 0;
  const cursor = new Date(created);
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + count - 1);

  while (cursor <= endDate) {
    const isActive = routine.selectedDays.includes(cursor.getDay());
    if (isActive) activeDayCount++;

    if (cursor >= today) {
      const dayType = isActive
        ? routine.cycle[(activeDayCount - 1 + routine.cycle.length) % routine.cycle.length]
        : null;
      result.push({ date: new Date(cursor), dayType, isToday: cursor.getTime() === today.getTime() });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return result.slice(0, count);
}

// ── Resolve blocks for a day-type, trimmed to fit available time ─
// Greedy left-to-right: include a block only if every included block
// (so far) can still receive at least its minMinutes once time is
// re-split proportionally among just the included blocks. Caps at 4.
export function getBlocksForDayType(dayType: DayType, minutesPerDay: number): (RoutineBlock & { minutes: number })[] {
  const all = BLOCKS[dayType].slice(0, 4); // hard cap at 4 blocks
  let included: RoutineBlock[] = [];

  for (const block of all) {
    const candidate = [...included, block];
    const totalWeight = candidate.reduce((s, b) => s + b.weight, 0);
    const minutesFor = (b: RoutineBlock) => Math.round((b.weight / totalWeight) * minutesPerDay);
    const allMeetMin = candidate.every(b => minutesFor(b) >= b.minMinutes);

    if (allMeetMin) {
      included = candidate;
    } else {
      break; // adding this block would starve someone below their floor
    }
  }

  // Always include at least the first block, even if minutesPerDay is tiny
  if (included.length === 0) included = [all[0]];

  const totalWeight = included.reduce((s, b) => s + b.weight, 0);
  return included.map(b => ({
    ...b,
    minutes: Math.max(b.minMinutes, Math.round((b.weight / totalWeight) * minutesPerDay)),
  }));
}

// ── Validation helpers for onboarding custom inputs ──────────────
export function sanitizeDays(input: string): number | null {
  const n = parseInt(input.replace(/[^0-9]/g, ''), 10);
  if (isNaN(n)) return null;
  return Math.min(7, Math.max(1, n));
}

export function sanitizeMinutes(input: string): number | null {
  const n = parseInt(input.replace(/[^0-9]/g, ''), 10);
  if (isNaN(n)) return null;
  return Math.min(180, Math.max(5, n));
}
