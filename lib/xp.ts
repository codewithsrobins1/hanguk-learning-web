import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// XP needed to go from level N to N+1
export function xpForLevel(n: number): number {
  return Math.floor(100 * Math.pow(n, 1.5));
}

// Total XP required to reach level N from level 1
export function totalXpForLevel(n: number): number {
  if (n <= 1) return 0;
  let total = 0;
  for (let i = 1; i < n; i++) total += xpForLevel(i);
  return total;
}

// What level is a given XP total
export function levelFromXp(xp: number): number {
  let level = 1;
  while (xp >= totalXpForLevel(level + 1)) level++;
  return level;
}

// Returns everything needed to render the XP bar
export function xpProgress(xp: number) {
  const level = levelFromXp(xp);
  const xpAtCurrentLevel = totalXpForLevel(level);
  const xpAtNextLevel = totalXpForLevel(level + 1);
  const xpIntoLevel = xp - xpAtCurrentLevel;
  const xpNeeded = xpAtNextLevel - xpAtCurrentLevel;
  return {
    level,
    xpIntoLevel,
    xpNeeded,
    progress: xpIntoLevel / xpNeeded,
  };
}

// Add XP to a user profile and recalculate level
export async function addXp(userId: string, amount: number): Promise<void> {
  const ref = doc(db, 'profiles', userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const currentXp: number = snap.data().xp ?? 0;
  const newXp = currentXp + amount;
  const newLevel = levelFromXp(newXp);
  await updateDoc(ref, { xp: newXp, level: newLevel });
}
