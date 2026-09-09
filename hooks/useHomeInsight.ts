'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { collection, query, where, getDocs, getDoc, getCountFromServer, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { useUserStats } from './useUserStats';
import { toMillis, countInRange, daysSinceLast } from '@/lib/weekly';
import { getWeekStartISO } from '@/lib/weekly';
import { WEEKLY_CATEGORIES, weeklyGoals, type WeeklyKey } from '@/lib/weekly-goals';

export type HomeInsight = { summary: string; recommendations: string[] };

type CategoryConfig = { key: WeeklyKey; label: string; field: string; collectionName: string };

// Same modest weekly pace as the Weekly Progress widget — kept local since
// this hook does its own last-week windowed count, not the live current-week one.
const CATEGORY_CONFIG: CategoryConfig[] = WEEKLY_CATEGORIES.map(c => ({ key: c.key, label: c.label, field: c.date, collectionName: c.collection }));

export function useHomeInsight() {
  const { user, profile, refreshProfile } = useAuth();
  const { stats, loading: statsLoading } = useUserStats();
  const [insight, setInsight] = useState<HomeInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const attempted = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const goals = weeklyGoals(profile?.weekly_goals);
  const settingsKey = JSON.stringify(goals);
  const isTracked = useCallback((key: WeeklyKey) => weeklyGoals(profile?.weekly_goals)[key].enabled, [profile?.weekly_goals]);

  const lifetimeFor = (label: string) => {
    switch (label) {
      case 'Vocab Cards': return { done: stats.cardsKnown, total: stats.totalCards };
      case 'Reading':   return { done: stats.passagesDone, total: stats.totalPassages };
      case 'Speaking':  return { done: stats.dialoguesDone, total: stats.totalDialogues };
      case 'Listening': return { done: stats.listeningDone, total: stats.totalListening };
      case 'Grammar':   return { done: stats.grammarDone, total: stats.totalGrammar };
      default:          return { done: 0, total: 0 };
    }
  };

  const generate = useCallback(async () => {
    if (!user || !profile?.weekly_reset_at) return;
    const enabledConfig = CATEGORY_CONFIG.filter(c => isTracked(c.key));
    if (enabledConfig.length === 0) { setInsight(null); return; }

    setLoading(true);
    try {
      const weekStart = toMillis(getWeekStartISO());
      const previousMonday = new Date(weekStart);
      previousMonday.setDate(previousMonday.getDate() - 7);
      const prevWeekStart = previousMonday.getTime();
      const freshProfile = (await getDoc(doc(db, 'profiles', user.uid))).data();
      const previous = freshProfile?.weekly_history?.[previousMonday.toISOString()];
      const previousGoals = weeklyGoals(previous?.goals ?? freshProfile?.weekly_goals);

      const snaps = await Promise.all(
        enabledConfig.map(c => getDocs(query(collection(db, c.collectionName), where('user_id', '==', user.uid))))
      );

      const patternIndex = enabledConfig.findIndex(c => c.label === 'Patterns');
      const patternLifetime = patternIndex < 0 ? { done: 0, total: 0 } : {
        done: snaps[patternIndex].docs.filter(d => d.data().last_completed).length,
        total: (await getCountFromServer(collection(db, 'patterns'))).data().count,
      };
      const categories = enabledConfig.map((c, i) => ({
        label: c.label,
        doneLastWeek: c.key !== 'cards' && previous?.counts[c.key] !== undefined
          ? previous.counts[c.key] : countInRange(snaps[i].docs, c.field, prevWeekStart, weekStart),
        repeatCounting: c.key !== 'cards' && previous?.counts[c.key] !== undefined,
        target: previousGoals[c.key].target,
        targetThisWeek: goals[c.key].target,
        daysSinceLastActivity: daysSinceLast(snaps[i].docs, c.field),
        lifetimeDone: c.label === 'Patterns' ? patternLifetime.done : lifetimeFor(c.label).done,
        lifetimeTotal: c.label === 'Patterns' ? patternLifetime.total : lifetimeFor(c.label).total,
      }));

      const res = await fetch('/api/home/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: stats.level, xp: stats.xp, currentStreak: profile?.current_streak ?? 0, categories }),
      });
      if (!res.ok) throw new Error('Insight generation failed');
      const data: HomeInsight = await res.json();

      await updateDoc(doc(db, 'profiles', user.uid), {
        ai_insight: {
          summary: data.summary,
          recommendations: data.recommendations,
          categories: categories.map(c => c.label),
          week_start: new Date(weekStart).toISOString(),
          version: 3,
          settings_key: settingsKey,
          generated_at: serverTimestamp(),
        },
      });
      await refreshProfile();
      setInsight(data);
    } catch (e) {
      console.error('Failed to generate home insight:', e);
      setError('Your recap could not be generated. Try again later.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile?.weekly_reset_at, isTracked, stats, profile?.current_streak, settingsKey]);

  useEffect(() => {
    if (!user || !profile?.weekly_reset_at) return;
    if (statsLoading) return;
    if (stats.xp <= 0) return; // nothing to say yet for brand-new accounts
    if (loading) return;

    const currentLabels = CATEGORY_CONFIG.filter(c => isTracked(c.key)).map(c => c.label);
    if (currentLabels.length === 0) { setInsight(null); return; }

    const cached = profile.ai_insight;
    const sameCategories = cached
      && cached.categories?.length === currentLabels.length
      && cached.categories.every(c => currentLabels.includes(c));
    const sameWeek = cached && cached.week_start === getWeekStartISO() && cached.version === 3 && cached.settings_key === settingsKey;

    if (cached && sameCategories && sameWeek) {
      setError(null);
      setInsight({ summary: cached.summary, recommendations: cached.recommendations });
    } else {
      setInsight(null);
      const key = `${user.uid}:${getWeekStartISO()}:${settingsKey}`;
      if (attempted.current !== key) {
        attempted.current = key;
        setError(null);
        generate();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile?.ai_insight, profile?.weekly_reset_at, settingsKey, statsLoading, stats.xp, loading]);

  return { insight, loading, error };
}
