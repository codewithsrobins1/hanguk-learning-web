'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useGrammarLessons, useMilestoneResults, LessonWithProgress, MilestoneResult } from '@/hooks/useGrammar';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const INTERESTS = [
  'Gaming', 'Food & Cooking', 'Travel & Culture', 'Music & Concerts',
  'Movies, TV & Anime', 'Sports & Fitness', 'Technology & Coding',
  'Fashion & Beauty', 'Daily Life & Relationships', 'History & True Crime',
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;
type Level = typeof LEVELS[number];

const LEVEL_PREFIX: Record<Level, string> = {
  Beginner: 'beg', Intermediate: 'int', Advanced: 'adv',
};

const LEVEL_COLORS: Record<Level, { bg: string; text: string; border: string }> = {
  Beginner:     { bg: '#F0FFF4', text: '#16A34A', border: '#86EFAC' },
  Intermediate: { bg: '#FFF7ED', text: '#F97316', border: '#FED7AA' },
  Advanced:     { bg: '#FFF0EE', text: '#E8412C', border: '#FCA5A5' },
};

const NODE_SIZE      = 72;
const MILESTONE_SIZE = 82;
const ROW_H          = 120;
const DIVIDER_H      = 72;
const CONTAINER_W    = 340;
const LEFT_X         = 70;
const RIGHT_X        = 270;

type NodeStatus = 'completed' | 'current' | 'unlocked' | 'locked';

type RawLessonNode    = { kind: 'lesson';    lesson: LessonWithProgress; status: NodeStatus; x: number };
type RawMilestoneNode = { kind: 'milestone'; milestoneId: string; level: Level; group: number; result: MilestoneResult | null; status: NodeStatus; x: number };
type RawDividerNode   = { kind: 'divider';   label: string };
type RawPathNode = RawLessonNode | RawMilestoneNode | RawDividerNode;

type PathNode =
  | (RawLessonNode    & { y: number })
  | (RawMilestoneNode & { y: number })
  | (RawDividerNode   & { y: number });

function formatMonthYear(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function buildPath(
  lessons: LessonWithProgress[],
  milestoneResults: Record<string, MilestoneResult>,
  filterLevel: Level | 'All'
): { nodes: PathNode[]; totalH: number } {
  const levels: Level[] = filterLevel === 'All' ? [...LEVELS] : [filterLevel];
  const rawNodes: RawPathNode[] = [];
  let lastX = RIGHT_X; // start RIGHT so first node goes LEFT
  const nextX = () => { lastX = lastX === LEFT_X ? RIGHT_X : LEFT_X; return lastX; };

  let prevDone = true;

  levels.forEach((level, li) => {
    if (filterLevel === 'All' && li > 0) {
      rawNodes.push({ kind: 'divider', label: level });
    }

    const levelLessons = lessons.filter(l => l.level === level);
    const groupCount = Math.ceil(levelLessons.length / 5);
    const prefix = LEVEL_PREFIX[level];

    for (let g = 1; g <= groupCount; g++) {
      const groupLessons = levelLessons.slice((g - 1) * 5, g * 5);

      groupLessons.forEach(lesson => {
        const status: NodeStatus = prevDone
          ? (lesson.completed_at ? 'completed' : 'unlocked')
          : 'locked';
        rawNodes.push({ kind: 'lesson', lesson, status, x: nextX() });
        prevDone = lesson.completed_at !== null;
      });

      const milestoneId = `milestone_${prefix}_${g}`;
      const result = milestoneResults[milestoneId] ?? null;
      const allGroupDone = groupLessons.every(l => l.completed_at !== null);
      let mStatus: NodeStatus = 'locked';
      if (result?.passed) mStatus = 'completed';
      else if (allGroupDone && prevDone) mStatus = 'unlocked';
      rawNodes.push({ kind: 'milestone', milestoneId, level, group: g, result, status: mStatus, x: nextX() });
      prevDone = result?.passed === true;
    }
  });

  let y = 48;
  let foundCurrent = false;
  const nodes: PathNode[] = rawNodes.map(n => {
    if (n.kind === 'divider') {
      const node = { ...n, y } as PathNode;
      y += DIVIDER_H;
      return node;
    }
    let status = n.status;
    if (!foundCurrent && status === 'unlocked') {
      status = 'current';
      foundCurrent = true;
    }
    const node = { ...n, status, y } as PathNode;
    y += ROW_H;
    return node;
  });

  return { nodes, totalH: y + 48 };
}

// ── Node components ───────────────────────────────────────────────
function LessonNode({ node }: { node: Extract<PathNode, { kind: 'lesson' }> }) {
  const s = node.status;
  const isPerfect = node.lesson.score !== null && node.lesson.score === node.lesson.total;

  const bg =
    s === 'completed' ? '#1A1F36'
    : s === 'current' || s === 'unlocked' ? '#fff'
    : '#ECEAE6';

  const border =
    s === 'current'  ? '#1A1F36'
    : s === 'unlocked' ? '#C4BFBA'
    : 'transparent';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      {/* Circle */}
      <div style={{
        width: NODE_SIZE, height: NODE_SIZE, borderRadius: '50%',
        background: bg, border: `2.5px solid ${border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: s === 'current' ? '0 0 0 7px rgba(26,31,54,0.12)' : 'none',
        flexShrink: 0,
      }}>
        {s === 'completed' ? (
          <span style={{ fontSize: 24, color: '#fff' }}>{isPerfect ? '⭐' : '✓'}</span>
        ) : s === 'locked' ? (
          <span style={{ fontSize: 22 }}>🔒</span>
        ) : (
          <span style={{
            fontSize: 13, fontWeight: 800, color: '#1A1F36',
            fontFamily: 'Noto Sans KR, sans-serif',
            lineHeight: 1.2, textAlign: 'center', padding: '0 6px',
          }}>
            {node.lesson.title_ko.length > 6 ? node.lesson.title_ko.slice(0, 6) + '…' : node.lesson.title_ko}
          </span>
        )}
      </div>

      {/* Subtext */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, maxWidth: 90 }}>
        {s === 'completed' ? (
          <>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#444', textAlign: 'center', lineHeight: 1.3 }}>
              {node.lesson.title_en}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#16A34A', whiteSpace: 'nowrap' }}>
              {node.lesson.completed_at ? formatMonthYear(node.lesson.completed_at) : ''}
            </span>
          </>
        ) : s !== 'locked' ? (
          <span style={{ fontSize: 12, fontWeight: 600, color: '#888', textAlign: 'center', lineHeight: 1.3 }}>
            {node.lesson.title_en}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function MilestoneNode({ node }: { node: Extract<PathNode, { kind: 'milestone' }> }) {
  const s = node.status;

  const bg =
    s === 'completed' ? '#F59E0B'
    : s === 'current' || s === 'unlocked' ? '#fff'
    : '#ECEAE6';

  const border =
    s === 'completed' ? '#F59E0B'
    : s === 'current' || s === 'unlocked' ? '#F59E0B'
    : 'transparent';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      {/* Circle */}
      <div style={{
        width: MILESTONE_SIZE, height: MILESTONE_SIZE, borderRadius: '50%',
        background: bg, border: `3px solid ${border}`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 2,
        boxShadow: (s === 'current' || s === 'unlocked') ? '0 0 0 7px rgba(245,158,11,0.12)' : 'none',
        flexShrink: 0,
      }}>
        {s === 'locked' ? (
          <span style={{ fontSize: 24 }}>🔒</span>
        ) : (
          <>
            <span style={{ fontSize: 26 }}>✏️</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: s === 'completed' ? '#fff' : '#F59E0B' }}>
              {s === 'completed' ? 'PASSED' : 'QUIZ'}
            </span>
          </>
        )}
      </div>

      {/* Subtext */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, maxWidth: 90 }}>
        {s === 'completed' && node.result?.completed_at ? (
          <>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#444', whiteSpace: 'nowrap' }}>
              Checkpoint {node.group}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B', whiteSpace: 'nowrap' }}>
              {formatMonthYear(node.result.completed_at)}
            </span>
          </>
        ) : s !== 'locked' ? (
          <span style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B', whiteSpace: 'nowrap' }}>
            Checkpoint {node.group}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function DividerBanner({ label }: { label: string }) {
  const c = LEVEL_COLORS[label as Level] ?? LEVEL_COLORS.Intermediate;
  return (
    <div style={{
      width: '100%', padding: '10px 20px',
      background: c.bg, border: `1.5px solid ${c.border}`,
      borderRadius: 16, display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{ flex: 1, height: 1, background: c.border }} />
      <span style={{ fontSize: 13, fontWeight: 800, color: c.text }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: c.border }} />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function GrammarPage() {
  const { user, profile, refreshProfile } = useAuth();
  const { lessons, loading: lessonsLoading } = useGrammarLessons();
  const { results, loading: resultsLoading } = useMilestoneResults();
  const router = useRouter();

  const [filterLevel, setFilterLevel] = useState<Level | 'All'>('All');
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const hasInterests = profile && profile.interests && profile.interests.length > 0;
  const loading = lessonsLoading || resultsLoading;

  const { nodes, totalH } = useMemo(() => {
    if (lessons.length === 0) return { nodes: [], totalH: 0 };
    return buildPath(lessons, results, filterLevel);
  }, [lessons, results, filterLevel]);

  const handleSaveInterests = async () => {
    if (!user || interests.length < 2) return;
    setSaving(true);
    await updateDoc(doc(db, 'profiles', user.uid), { interests });
    await refreshProfile();
    setSaving(false);
  };

  const toggleInterest = (i: string) => {
    setInterests(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : prev.length < 4 ? [...prev, i] : prev
    );
  };

  const handleNodeClick = (node: PathNode) => {
    if (node.kind === 'lesson' && node.status !== 'locked')
      router.push(`/grammar/${node.lesson.id}`);
    if (node.kind === 'milestone' && node.status !== 'locked')
      router.push(`/grammar/milestone/${node.milestoneId}`);
  };

  if (!hasInterests) {
    return (
      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-extrabold text-ink mb-1 text-center">Pick your interests.</h1>
        <p className="text-sm text-muted text-center mb-8">Select 2 to 4 — examples will match what you love.</p>
        <div className="flex flex-wrap gap-2.5 justify-center mb-10">
          {INTERESTS.map(i => {
            const sel = interests.includes(i);
            return (
              <button key={i} onClick={() => toggleInterest(i)}
                className="px-4 py-2 rounded-full text-sm font-semibold border-[1.5px] transition-all"
                style={{ background: sel ? '#1A1F36' : '#fff', color: sel ? '#F7F4EE' : '#444', borderColor: sel ? '#1A1F36' : '#E8E3D8' }}
              >{i}</button>
            );
          })}
        </div>
        <p className="text-center text-xs text-muted mb-4">
          {interests.length < 2 ? `Select ${2 - interests.length} more` : `${interests.length} selected${interests.length < 4 ? ' · up to 4' : ''}`}
        </p>
        <button onClick={handleSaveInterests} disabled={interests.length < 2 || saving}
          className="btn-press w-full py-4 rounded-2xl font-quicksand font-bold text-base disabled:opacity-40"
          style={{ background: '#1A1F36', color: '#F7F4EE' }}
        >{saving ? 'Saving...' : 'Continue →'}</button>
      </div>
    );
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-red border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const totalLessons   = lessons.length;
  const doneLessons    = lessons.filter(l => l.completed_at).length;
  const doneMilestones = Object.values(results).filter(r => r.passed).length;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8" style={{ overflowX: 'hidden' }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-ink mb-1">Grammar</h1>
          <p className="text-sm text-muted">{doneLessons}/{totalLessons} lessons · {doneMilestones} milestones passed</p>
        </div>
        <button onClick={() => router.push('/profile')}
          className="text-[11px] font-semibold text-muted hover:text-ink transition-colors mt-1"
        >Edit interests</button>
      </div>

      {/* Level filter tabs */}
      <div className="flex gap-2 mb-8">
        {(['All', ...LEVELS] as const).map(level => {
          const isActive = filterLevel === level;
          const c = level !== 'All' ? LEVEL_COLORS[level] : null;
          return (
            <button key={level} onClick={() => setFilterLevel(level)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold border-[1.5px] transition-all"
              style={{
                background: isActive ? (c ? c.text : '#1A1F36') : '#fff',
                color: isActive ? '#fff' : (c ? c.text : '#444'),
                borderColor: c ? c.text : '#E8E3D8',
              }}
            >{level}</button>
          );
        })}
      </div>

      {/* Roadmap — centres within available width, clips overflow */}
      <div style={{ overflowX: 'hidden', width: '100%' }}>
        <div style={{ position: 'relative', width: CONTAINER_W, margin: '0 auto', height: totalH }}>

          {/* SVG lines */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: CONTAINER_W, height: totalH, pointerEvents: 'none' }}>
            {nodes.map((node, i) => {
              if (i === 0 || node.kind === 'divider') return null;
              const prev = nodes[i - 1];
              if (prev.kind === 'divider') return null;
              const done = prev.kind === 'lesson'
                ? prev.lesson.completed_at !== null
                : prev.kind === 'milestone' ? prev.result?.passed === true : false;
              return (
                <line key={i}
                  x1={prev.x} y1={prev.y}
                  x2={node.x} y2={node.y}
                  stroke={done ? '#1A1F36' : '#E8E3D8'}
                  strokeWidth={done ? 3 : 2}
                  strokeDasharray={done ? 'none' : '6 4'}
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node, i) => {
            if (node.kind === 'divider') {
              return (
                <div key={i} style={{ position: 'absolute', top: node.y - DIVIDER_H / 2, left: 0, width: '100%' }}>
                  <DividerBanner label={node.label} />
                </div>
              );
            }

            const size = node.kind === 'milestone' ? MILESTONE_SIZE : NODE_SIZE;

            return (
              <div key={i}
                onClick={() => handleNodeClick(node)}
                style={{
                  position: 'absolute',
                  left: node.x - size / 2,
                  top: node.y - size / 2,
                  cursor: node.status === 'locked' ? 'default' : 'pointer',
                }}
              >
                {node.kind === 'lesson'
                  ? <LessonNode node={node} />
                  : <MilestoneNode node={node} />
                }
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center mt-10 mb-4">
        {[
          { color: '#1A1F36', label: 'Completed' },
          { color: '#fff', border: '#1A1F36', label: 'Current' },
          { color: '#fff', border: '#C4BFBA', label: 'Unlocked' },
          { color: '#ECEAE6', label: 'Locked' },
          { color: '#F59E0B', label: 'Checkpoint' },
        ].map(({ color, border, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: color, border: border ? `2px solid ${border}` : 'none' }} />
            <span className="text-[11px] text-muted font-semibold">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
