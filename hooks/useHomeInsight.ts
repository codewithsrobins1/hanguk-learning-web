'use client';
import { useEffect, useState, useCallback } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { useUserStats } from './useUserStats';
import { toMillis, countInRange, daysSinceLast } from '@/lib/weekly';
import { NAV_ITEMS, navPrefKey } from '@/lib/nav-config';

export type HomeInsight = { summary: string; recommendations: string[] };

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

type CategoryConfig = { href: string; label: string; field: string; collectionName: string; target: number };

// Same modest weekly pace as the Weekly Progress widget — kept local since
// this hook does its own last-week windowed count, not the live current-week one.
const CATEGORY_CONFIG: CategoryConfig[] = [
  { href: '/cards',    label: 'Vocab',     field: 'last_reviewed', collectionName: 'user_card_progress',      target: 15 },
  { href: '/read',     label: 'Reading',   field: 'completed_at',  collectionName: 'user_passage_progress',   target: 3 },
  { href: '/shadow',   label: 'Speaking',  field: 'completed_at',  collectionName: 'user_dialogue_progress',  target: 2 },
  { href: '/listen',   label: 'Listening', field: 'completed_at',  collectionName: 'user_listening_progress', target: 3 },
  { href: '/patterns', label: 'Patterns',  field: 'last_completed',collectionName: 'user_pattern_progress',   target: 5 },
  { href: '/grammar',  label: 'Grammar',   field: 'completed_at',  collectionName: 'user_grammar_progress',   target: 3 },
];

export function useHomeInsight() {
  const { user, profile, refreshProfile } = useAuth();
  const { stats, loading: statsLoading } = useUserStats();
  const [insight, setInsight] = useState<HomeInsight | null>(null);
  const [loading, setLoading] = useState(false);

  const isNavEnabled = useCallback((href: string) => {
    const item = NAV_ITEMS.find(n => n.href === href);
    if (!item) return false;
    return profile?.nav_preferences?.[navPrefKey(href)] ?? item.enabled;
  }, [profile?.nav_preferences]);

  const lifetimeFor = (label: string) => {
    switch (label) {
      case 'Vocab':     return { done: stats.cardsKnown, total: stats.totalCards };
      case 'Reading':   return { done: stats.passagesDone, total: stats.totalPassages };
      case 'Speaking':  return { done: stats.dialoguesDone, total: stats.totalDialogues };
      case 'Listening': return { done: stats.listeningDone, total: stats.totalListening };
      case 'Grammar':   return { done: stats.grammarDone, total: stats.totalGrammar };
      default:          return { done: 0, total: 0 };
    }
  };

  const generate = useCallback(async () => {
    if (!user || !profile?.weekly_reset_at) return;
    const enabledConfig = CATEGORY_CONFIG.filter(c => isNavEnabled(c.href));
    if (enabledConfig.length === 0) { setInsight(null); return; }

    setLoading(true);
    try {
      const weekStart = toMillis(profile.weekly_reset_at);
      const prevWeekStart = weekStart - WEEK_MS;

      const snaps = await Promise.all(
        enabledConfig.map(c => getDocs(query(collection(db, c.collectionName), where('user_id', '==', user.uid))))
      );

      const categories = enabledConfig.map((c, i) => ({
        label: c.label,
        doneLastWeek: countInRange(snaps[i].docs, c.field, prevWeekStart, weekStart),
        target: c.target,
        daysSinceLastActivity: daysSinceLast(snaps[i].docs, c.field),
        ...lifetimeFor(c.label),
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
          week_start: profile.weekly_reset_at,
          generated_at: serverTimestamp(),
        },
      });
      await refreshProfile();
      setInsight(data);
    } catch (e) {
      console.error('Failed to generate home insight:', e);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile?.weekly_reset_at, isNavEnabled, stats, profile?.current_streak]);

  useEffect(() => {
    if (!user || !profile?.weekly_reset_at) return;
    if (statsLoading) return;
    if (stats.xp <= 0) return; // nothing to say yet for brand-new accounts
    if (loading) return;

    const currentLabels = CATEGORY_CONFIG.filter(c => isNavEnabled(c.href)).map(c => c.label);
    if (currentLabels.length === 0) { setInsight(null); return; }

    const cached = profile.ai_insight;
    const sameCategories = cached
      && cached.categories?.length === currentLabels.length
      && cached.categories.every(c => currentLabels.includes(c));
    const sameWeek = cached && cached.week_start === profile.weekly_reset_at;

    if (cached && sameCategories && sameWeek) {
      setInsight({ summary: cached.summary, recommendations: cached.recommendations });
    } else {
      generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile?.ai_insight, profile?.weekly_reset_at, profile?.nav_preferences, statsLoading, stats.xp, loading]);

  return { insight, loading };
}
