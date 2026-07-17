'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePatterns, PatternWithProgress } from '@/hooks/usePatterns';
import { staggerContainer, staggerItem } from '@/lib/motion-variants';

const TIER_ORDER  = ['Survival', 'Conversational', 'Fluency'] as const;
const TIER_COLORS = {
  Survival:      { bg: '#F0FFF4', text: '#16A34A', border: '#86EFAC' },
  Conversational:{ bg: '#EFF6FF', text: '#3B82F6', border: '#93C5FD' },
  Fluency:       { bg: '#FFF7ED', text: '#F97316', border: '#FED7AA' },
};

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
}

function ProgressDots({ completed, total }: { completed: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="w-2 h-2 rounded-full transition-colors"
          style={{ background: i < completed ? '#1A1F36' : '#E8E3D8' }} />
      ))}
    </div>
  );
}

function PatternCard({ pattern }: { pattern: PatternWithProgress }) {
  const totalRounds = pattern.rounds?.length ?? 4;
  const done        = pattern.rounds_completed >= totalRounds;

  return (
    <Link href={`/patterns/${pattern.id}`}
      className="bg-white rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-ink transition-colors"
      style={{
        border: done ? '2px solid #86EFAC' : '2px solid #E8E3D8',
        boxShadow: '0 3px 14px rgba(26,31,54,0.07)',
      }}>
      <div className="flex-1 min-w-0">
        <p className="font-quicksand font-bold text-ink text-base mb-0.5"
          style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
          {pattern.frame}
        </p>
        <p className="text-xs text-muted mb-2">{pattern.frame_translation}</p>
        <ProgressDots completed={pattern.rounds_completed} total={totalRounds} />
        {pattern.last_completed && (
          <p className="text-[10px] text-muted mt-1.5">
            Last completed: {formatDate(pattern.last_completed)}
          </p>
        )}
      </div>
      <span className="text-muted text-lg flex-shrink-0">→</span>
    </Link>
  );
}

export default function PatternsPage() {
  const { patterns, loading } = usePatterns();
  const [activeTier, setActiveTier] = useState<typeof TIER_ORDER[number] | 'All'>('All');

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-red border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Group by category, filtered by tier
  const filtered = activeTier === 'All' ? patterns : patterns.filter(p => p.tier === activeTier);
  const categories = Array.from(new Set(filtered.map(p => p.category)));

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8">

      <h1 className="font-quicksand font-bold text-ink text-3xl mb-1">Patterns</h1>
      <p className="text-sm text-muted mb-6">Master the frames of everyday Korean speech</p>

      {/* Tier filter tabs */}
      <div className="flex gap-2 mb-7 max-w-lg">
        {(['All', ...TIER_ORDER] as const).map(tier => {
          const isActive = activeTier === tier;
          const c = tier !== 'All' ? TIER_COLORS[tier] : null;
          return (
            <button key={tier} onClick={() => setActiveTier(tier)}
              className="flex-1 py-2 rounded-xl text-xs font-bold border-[1.5px] transition-all"
              style={{
                background:  isActive ? (c ? c.text : '#1A1F36') : '#fff',
                color:       isActive ? '#fff' : (c ? c.text : '#444'),
                borderColor: c ? c.text : '#E8E3D8',
              }}>
              {tier}
            </button>
          );
        })}
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-8">
        {categories.map(category => {
          const catPatterns = filtered.filter(p => p.category === category);
          const tier        = catPatterns[0]?.tier;
          const c           = tier ? TIER_COLORS[tier] : TIER_COLORS.Survival;
          const doneCount   = catPatterns.filter(p => p.rounds_completed >= (p.rounds?.length ?? 4)).length;

          return (
            <div key={category}>
              {/* Category header */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full flex-shrink-0"
                  style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                  {tier}
                </span>
                <p className="font-quicksand font-bold text-ink text-base">{category}</p>
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted flex-shrink-0">{doneCount}/{catPatterns.length}</span>
              </div>

              {/* Pattern cards */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {catPatterns.map(p => (
                  <motion.div key={p.id} variants={staggerItem}>
                    <PatternCard pattern={p} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
