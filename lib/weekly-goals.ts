export const WEEKLY_CATEGORIES = [
  { key: 'cards', label: 'Vocab Cards', field: 'cardsReviewed', collection: 'user_card_progress', date: 'last_reviewed' },
  { key: 'passages', label: 'Reading', field: 'passagesDone', collection: 'user_passage_progress', date: 'completed_at' },
  { key: 'dialogues', label: 'Speaking', field: 'dialoguesDone', collection: 'user_dialogue_progress', date: 'completed_at' },
  { key: 'listening', label: 'Listening', field: 'listeningDone', collection: 'user_listening_progress', date: 'completed_at' },
  { key: 'patterns', label: 'Patterns', field: 'patternsDone', collection: 'user_pattern_progress', date: 'last_completed' },
  { key: 'grammar', label: 'Grammar', field: 'grammarDone', collection: 'user_grammar_progress', date: 'completed_at' },
] as const;
export type WeeklyKey = typeof WEEKLY_CATEGORIES[number]['key'];
export type WeeklyGoals = Record<WeeklyKey, { enabled: boolean; target: number }>;
export type WeekRecord = { counts: Partial<Record<WeeklyKey, number>>; baseline: Partial<Record<WeeklyKey, number>>; goals: WeeklyGoals };
export type WeeklyHistory = Record<string, WeekRecord>;
export const WEEKLY_TARGETS = { cards: 10, passages: 3, dialogues: 3, listening: 3, patterns: 3, grammar: 3 };

export function weeklyGoals(saved?: Partial<WeeklyGoals>): WeeklyGoals {
  return Object.fromEntries(WEEKLY_CATEGORIES.map(({ key }) => [key, {
    enabled: saved?.[key]?.enabled ?? true,
    target: Number.isInteger(saved?.[key]?.target) && saved![key]!.target >= 1 && saved![key]!.target <= 999
      ? saved![key]!.target : WEEKLY_TARGETS[key],
  }])) as WeeklyGoals;
}

export function weekRecord(history: WeeklyHistory | undefined, week: string, goals?: Partial<WeeklyGoals>): WeekRecord {
  const existing = history?.[week];
  return { counts: { ...existing?.counts }, baseline: { ...existing?.baseline }, goals: weeklyGoals(existing?.goals ?? goals) };
}

export function retainWeeks(history: WeeklyHistory): WeeklyHistory {
  return Object.fromEntries(Object.entries(history).sort(([a], [b]) => b.localeCompare(a)).slice(0, 8));
}
