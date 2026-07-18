'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { hangulVowels, hangulConsonants } from '@/data/hangul';

type Tab = 'vowels' | 'consonants';

export default function HangulReferencePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab: Tab = searchParams.get('tab') === 'consonants' ? 'consonants' : 'vowels';
  const [tab, setTab] = useState<Tab>(initialTab);
  const [expanded, setExpanded] = useState<string | null>(null);

  const chars = tab === 'vowels' ? hangulVowels : hangulConsonants;

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => router.push('/hangul')} className="text-2xl text-muted hover:text-ink transition-colors">←</button>
        <p className="font-quicksand font-bold text-ink text-base">Reference · 모음/자음</p>
        <div className="w-6" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-white rounded-xl p-1 mb-5" style={{ border: '1px solid #E8E3D8' }}>
        {(['vowels', 'consonants'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setExpanded(null); }}
            className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors capitalize"
            style={{
              background: tab === t ? '#1A1F36' : 'transparent',
              color: tab === t ? '#F7F4EE' : '#888',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Character grid */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {chars.map((c) => {
          const isExpanded = expanded === c.char;
          return (
            <button
              key={c.char}
              onClick={() => setExpanded(isExpanded ? null : c.char)}
              className={`bg-cream rounded-xl flex flex-col items-center justify-center gap-1 py-3 px-1 text-center transition-all ${isExpanded ? 'col-span-2 row-span-1' : ''}`}
              style={{ gridColumn: isExpanded ? 'span 2 / span 2' : undefined }}
            >
              <span className="font-bold text-ink text-2xl" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                {c.char}
              </span>
              <span className="font-bold text-red text-xs">{c.romanization}</span>
              {isExpanded && c.example && (
                <span className="text-[10px] text-muted leading-tight mt-0.5">
                  {c.example.word}<br />({c.example.romanization} — {c.example.meaning})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Practice CTA */}
      <button
        onClick={() => router.push('/hangul/session')}
        className="btn-press w-full py-4 rounded-2xl bg-navy text-cream font-quicksand font-bold text-base"
      >
        Practice these →
      </button>
    </div>
  );
}
