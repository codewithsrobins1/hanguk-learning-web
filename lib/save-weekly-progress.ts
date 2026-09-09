import { collection, doc, getDocs, query, where, runTransaction, type DocumentReference, type DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import { countInRange, getWeekStartISO, toMillis } from './weekly';
import { WEEKLY_CATEGORIES, weeklyGoals, weekRecord, retainWeeks, type WeeklyGoals, type WeeklyKey } from './weekly-goals';

const pending = new Map<string, Promise<void>>();
export function saveWeeklyCompletion(ref: DocumentReference, data: DocumentData, key: Exclude<WeeklyKey, 'cards'>) {
  const active = pending.get(ref.path);
  if (active) return active;
  const request = commitWeeklyCompletion(ref, data, key).finally(() => pending.delete(ref.path));
  pending.set(ref.path, request);
  return request;
}

// The profile and existing progress record commit together under the existing rules.
async function commitWeeklyCompletion(ref: DocumentReference, data: DocumentData, key: Exclude<WeeklyKey, 'cards'>) {
  const category = WEEKLY_CATEGORIES.find(c => c.key === key)!;
  const week = getWeekStartISO();
  const priorDate = new Date(week);
  priorDate.setDate(priorDate.getDate() - 7);
  const prior = priorDate.toISOString();
  const existing = await getDocs(query(collection(db, category.collection), where('user_id', '==', data.user_id)));
  const profileRef = doc(db, 'profiles', data.user_id);
  await runTransaction(db, async tx => {
    const profile = (await tx.get(profileRef)).data();
    if (!profile) throw new Error('Profile unavailable. Please sign in again.');
    const current = weekRecord(profile.weekly_history, week, profile.weekly_goals);
    const previous = weekRecord(profile.weekly_history, prior, profile.weekly_goals);
    previous.counts[key] ??= countInRange(existing.docs, category.date, toMillis(prior), toMillis(week));
    const legacy = countInRange(existing.docs, category.date, toMillis(week), Infinity);
    if (current.counts[key] === undefined) {
      current.counts[key] = legacy;
      current.baseline[key] = legacy - countInRange(existing.docs, category.date,
        Math.max(toMillis(week), toMillis(profile.weekly_reset_at)), Infinity);
    }
    current.counts[key]! += 1;
    tx.set(ref, data, { merge: true });
    tx.update(profileRef, { weekly_history: retainWeeks({ ...profile.weekly_history, [prior]: previous, [week]: current }) });
  });
}

export async function configureWeeklyGoals(userId: string, goals: WeeklyGoals) {
  for (const { key } of WEEKLY_CATEGORIES) {
    if (!Number.isInteger(goals[key].target) || goals[key].target < 1 || goals[key].target > 999) throw new Error('Enter whole-number goals from 1 to 999.');
  }
  const ref = doc(db, 'profiles', userId);
  await runTransaction(db, async tx => {
    const profile = (await tx.get(ref)).data();
    if (!profile) throw new Error('Profile unavailable');
    const week = getWeekStartISO();
    const priorDate = new Date(week);
    priorDate.setDate(priorDate.getDate() - 7);
    const prior = priorDate.toISOString();
    const previous = weekRecord(profile.weekly_history, prior, profile.weekly_goals);
    const current = weekRecord(profile.weekly_history, week, profile.weekly_goals);
    current.goals = weeklyGoals(goals);
    tx.update(ref, { weekly_goals: current.goals,
      weekly_history: retainWeeks({ ...profile.weekly_history, [prior]: previous, [week]: current }) });
  });
}

export async function resetWeeklyProgress(userId: string) {
  const ref = doc(db, 'profiles', userId);
  await runTransaction(db, async tx => {
    const profile = (await tx.get(ref)).data();
    if (!profile) throw new Error('Profile unavailable');
    const week = getWeekStartISO();
    const current = weekRecord(profile.weekly_history, week, profile.weekly_goals);
    current.baseline = { ...current.counts };
    tx.update(ref, { weekly_reset_at: new Date().toISOString(),
      weekly_history: retainWeeks({ ...profile.weekly_history, [week]: current }) });
  });
}
