'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useGrammarLessons, LessonWithProgress } from '@/hooks/useGrammar';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const INTERESTS = [
  'Gaming', 'Food & Cooking', 'Travel & Culture', 'Music & Concerts',
  'Movies, TV & Anime', 'Sports & Fitness', 'Technology & Coding',
  'Fashion & Beauty', 'Daily Life & Relationships', 'History & True Crime',
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;

const LEVEL_COLORS = {
  Beginner:     { bg: '#F0FFF4', text: '#16A34A' },
  Intermediate: { bg: '#FFF7ED', text: '#F97316' },
  Advanced:     { bg: '#FFF0EE', text: '#E8412C' },
};

function formatDate(date: Date | null) {
  if (!date) return null;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function LessonCard({ lesson }: { lesson: LessonWithProgress }) {
  const isPerfect = lesson.score !== null && lesson.score === lesson.total;
  return (
    <Link
      href={`/grammar/${lesson.id}`}
      className="bg-white border-[1.5px] border-border rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:border-ink transition-colors"
    >
      <div className="flex-1 min-w-0">
        <p className="font-extrabold text-base text-ink truncate" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
          {lesson.title_ko}
        </p>
        <p className="text-xs text-muted mb-1 truncate">{lesson.title_en}</p>
        {lesson.completed_at ? (
          <p className="text-[11px] font-semibold" style={{ color: isPerfect ? '#16A34A' : '#888' }}>
            {isPerfect ? '⭐ Perfect · ' : '✓ '}{formatDate(lesson.completed_at)}
          </p>
        ) : (
          <p className="text-[11px] text-muted">Not started</p>
        )}
      </div>
      <span className="text-muted flex-shrink-0">→</span>
    </Link>
  );
}

export default function GrammarPage() {
  const { user, profile, refreshProfile } = useAuth();
  const { lessons, loading } = useGrammarLessons();
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<typeof LEVELS[number]>('Beginner');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const hasInterests = profile && profile.interests && profile.interests.length > 0;

  const handleSaveInterests = async () => {
    if (!user || selected.length < 2) return;
    setSaving(true);
    await updateDoc(doc(db, 'profiles', user.uid), { interests: selected });
    await refreshProfile();
    setSaving(false);
  };

  const toggleInterest = (interest: string) => {
    setSelected(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : prev.length < 4 ? [...prev, interest] : prev
    );
  };

  const scrollToLevel = (level: typeof LEVELS[number]) => {
    setActiveTab(level);
    sectionRefs.current[level]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ── Interest picker ──────────────────────────────────────────
  if (!hasInterests) {
    return (
      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-extrabold text-ink mb-1 text-center">Pick your interests.</h1>
        <p className="text-sm text-muted text-center mb-8">
          Select 2 to 4 — grammar examples will be tailored to what you love.
        </p>
        <div className="flex flex-wrap gap-2.5 justify-center mb-10">
          {INTERESTS.map(interest => {
            const isSelected = selected.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className="px-4 py-2 rounded-full text-sm font-semibold border-[1.5px] transition-all"
                style={{
                  background: isSelected ? '#1A1F36' : '#fff',
                  color: isSelected ? '#F7F4EE' : '#444',
                  borderColor: isSelected ? '#1A1F36' : '#E8E3D8',
                }}
              >
                {interest}
              </button>
            );
          })}
        </div>
        <p className="text-center text-xs text-muted mb-4">
          {selected.length < 2
            ? `Select ${2 - selected.length} more to continue`
            : `${selected.length} selected${selected.length < 4 ? ' · you can pick up to 4' : ' · max reached'}`}
        </p>
        <button
          onClick={handleSaveInterests}
          disabled={selected.length < 2 || saving}
          className="w-full py-4 rounded-2xl font-extrabold text-sm transition-opacity disabled:opacity-40"
          style={{ background: '#1A1F36', color: '#F7F4EE' }}
        >
          {saving ? 'Saving...' : 'Continue →'}
        </button>
      </div>
    );
  }

  // ── Lesson list ─────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-red border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-ink mb-1">Grammar</h1>
          <p className="text-sm text-muted">60 lessons · Beginner to Advanced</p>
        </div>
        <Link href="/profile" className="text-[11px] font-semibold text-muted hover:text-ink transition-colors mt-1">
          Edit interests
        </Link>
      </div>

      {/* Sticky level tabs */}
      <div className="sticky top-0 z-10 bg-cream pt-1 pb-3 -mx-6 px-6">
        <div className="flex gap-2">
          {LEVELS.map(level => {
            const c = LEVEL_COLORS[level];
            const count = lessons.filter(l => l.level === level).length;
            const done  = lessons.filter(l => l.level === level && l.completed_at).length;
            const isActive = activeTab === level;
            return (
              <button
                key={level}
                onClick={() => scrollToLevel(level)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold border-[1.5px] transition-all"
                style={{
                  background: isActive ? c.text : '#fff',
                  color: isActive ? '#fff' : c.text,
                  borderColor: c.text,
                }}
              >
                {level}
                <span className="block text-[10px] font-semibold mt-0.5 opacity-80">
                  {done}/{count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lesson sections */}
      {LEVELS.map(level => {
        const c = LEVEL_COLORS[level];
        const levelLessons = lessons.filter(l => l.level === level);
        const completed = levelLessons.filter(l => l.completed_at).length;
        return (
          <div
            key={level}
            ref={el => { sectionRefs.current[level] = el; }}
            className="mb-8 scroll-mt-24"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-extrabold px-3 py-1 rounded-full" style={{ background: c.bg, color: c.text }}>
                {level}
              </span>
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted font-semibold">{completed}/{levelLessons.length}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {levelLessons.map(lesson => <LessonCard key={lesson.id} lesson={lesson} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
