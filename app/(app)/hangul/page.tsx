'use client';
import { useState } from 'react';
import Link from 'next/link';
import { hangulVowels, hangulConsonants, allHangul } from '@/data/hangul';

export default function HangulPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const focusData = selected
    ? allHangul.find((c) => c.char === selected)
    : hangulConsonants.find((c) => c.char === 'ㅎ');

  const sets = [
    {
      id: 'vowels',
      label: 'Vowels',
      count: hangulVowels.length,
      icon: 'ㅏ',
      bg: '#EFF6FF',
      color: '#3B82F6',
    },
    {
      id: 'consonants',
      label: 'Consonants',
      count: hangulConsonants.length,
      icon: 'ㄱ',
      bg: '#F5F3FF',
      color: '#8B5CF6',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-extrabold text-ink mb-6">Hangul</h1>

      {/* Set cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {sets.map((s) => (
          <Link
            key={s.id}
            href="/hangul/session"
            className="rounded-2xl p-5 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: s.bg }}
          >
            <p
              className="text-3xl mb-3"
              style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
            >
              {s.icon}
            </p>
            <p className="font-extrabold text-ink mb-1">{s.label}</p>
            <p className="text-xs text-muted">{s.count} characters →</p>
          </Link>
        ))}
      </div>

      {/* Focus character */}
      <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-border mb-6">
        <p className="text-[10px] font-bold text-muted tracking-widest mb-4">
          FOCUS CHARACTER
        </p>
        <p
          className="text-[80px] font-bold text-ink leading-none mb-3"
          style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
        >
          {focusData?.char}
        </p>
        <p className="text-xl font-extrabold text-red mb-1">
          {focusData?.romanization}
        </p>
        <p className="text-sm text-muted">{focusData?.sound}</p>
      </div>

      {/* Vowels */}
      <p className="text-sm font-bold text-muted tracking-wider mb-3">VOWELS</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {hangulVowels.map((c) => (
          <button
            key={c.char}
            onClick={() => setSelected(c.char)}
            className={`w-[18%] py-2.5 rounded-xl border-[1.5px] flex flex-col items-center transition-colors ${
              selected === c.char
                ? 'bg-ink border-ink text-cream'
                : 'bg-white border-border hover:border-ink'
            }`}
          >
            <span
              className="text-lg"
              style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
            >
              {c.char}
            </span>
            <span
              className={`text-[9px] mt-0.5 ${selected === c.char ? 'text-gray-400' : 'text-muted'}`}
            >
              {c.romanization}
            </span>
          </button>
        ))}
      </div>

      {/* Consonants */}
      <p className="text-sm font-bold text-muted tracking-wider mb-3">
        CONSONANTS
      </p>
      <div className="flex flex-wrap gap-2">
        {hangulConsonants.map((c) => (
          <button
            key={c.char}
            onClick={() => setSelected(c.char)}
            className={`w-[18%] py-2.5 rounded-xl border-[1.5px] flex flex-col items-center transition-colors ${
              selected === c.char
                ? 'bg-ink border-ink text-cream'
                : 'bg-white border-border hover:border-ink'
            }`}
          >
            <span
              className="text-lg"
              style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
            >
              {c.char}
            </span>
            <span
              className={`text-[9px] mt-0.5 ${selected === c.char ? 'text-gray-400' : 'text-muted'}`}
            >
              {c.romanization}
            </span>
          </button>
        ))}
      </div>
      <div className="h-8" />
    </div>
  );
}
