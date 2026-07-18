// Monday-anchored week boundary, matching the lazy client-side reset pattern
// used for streaks in lib/auth.tsx (no backend cron exists in this app).
export function getWeekStartISO(d: Date = new Date()): string {
  const day = d.getDay(); // 0 = Sun .. 6 = Sat
  const diffToMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
}

// Progress docs mix ISO date strings (card/passage) and Firestore
// serverTimestamps (dialogue/listening) — normalize both to millis.
export function toMillis(value: any): number {
  if (!value) return 0;
  if (typeof value === 'string') return new Date(value).getTime();
  if (typeof value?.toDate === 'function') return value.toDate().getTime();
  if (value instanceof Date) return value.getTime();
  return 0;
}

export function countInRange(docs: { data: () => any }[], field: string, start: number, end: number): number {
  return docs.filter(d => {
    const t = toMillis(d.data()[field]);
    return t >= start && t < end;
  }).length;
}

export function daysSinceLast(docs: { data: () => any }[], field: string): number | null {
  const timestamps = docs.map(d => toMillis(d.data()[field])).filter(t => t > 0);
  if (timestamps.length === 0) return null;
  return Math.floor((Date.now() - Math.max(...timestamps)) / 86400000);
}
