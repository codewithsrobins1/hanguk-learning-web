'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePassages } from '@/hooks/usePassages';
import { categoryPill } from '@/lib/category-colors';
import { staggerContainer, staggerItem } from '@/lib/motion-variants';

const selectStyle = {
  backgroundColor: '#fff',
  border: '1.5px solid #E8E3D8',
  borderRadius: 12,
  padding: '0 12px',
  height: 40,
  fontSize: 13,
  fontWeight: 600,
  color: '#111',
  outline: 'none',
  cursor: 'pointer',
  appearance: 'none' as const,
  WebkitAppearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  paddingRight: 30,
};

export default function ReadPage() {
  const { passages, loading } = usePassages();
  const [search, setSearch] = useState('');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [category, setCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(passages.map(p => p.category)))];

  const filtered = passages.filter(p => {
    const matchesCategory = category === 'All' || p.category === category;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.title_en.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch && (!hideCompleted || !p.done);
  });

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <h1 className="font-quicksand font-bold text-ink text-3xl mb-5">Reading</h1>

      {/* Search + Filter row */}
      <div className="flex gap-2 mb-5">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search passages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-8 pr-3 rounded-xl border border-border bg-white text-sm font-medium text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors"
          />
        </div>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={selectStyle}
        >
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>


      {/* Hide completed toggle */}
      <label className="flex items-center gap-2 cursor-pointer mb-5 w-fit">
        <div
          onClick={() => setHideCompleted(h => !h)}
          className="relative w-9 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0"
          style={{ background: hideCompleted ? '#1A1F36' : '#E8E3D8' }}
        >
          <div className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
            style={{ left: hideCompleted ? '18px' : '2px' }} />
        </div>
        <span className="text-sm font-semibold text-muted">Hide completed</span>
      </label>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-2">
          <p className="text-2xl">🔍</p>
          <p className="text-muted text-sm font-medium">No passages match your search</p>
          <button onClick={() => { setSearch(''); setCategory('All'); }} className="text-xs font-bold text-ink underline mt-1">Clear filters</button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {filtered.map(p => {
            const cat = categoryPill(p.category);
            return (
              <motion.div key={p.id} variants={staggerItem}>
                <Link
                  href={`/read/${p.id}`}
                  className="relative bg-white rounded-2xl p-4 hover:border-ink transition-colors group block"
                  style={{
                    boxShadow: '0 3px 14px rgba(26,31,54,0.07)',
                    border: '1px solid #E8E3D8',
                  }}
                >
                  {p.done && (
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full" style={{ background: '#34A853' }} />
                  )}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xl font-extrabold text-ink mb-0.5" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{p.title}</p>
                      <p className="text-xs text-muted">{p.title_en}</p>
                    </div>
                    {p.done && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg border-[1.5px] border-green bg-greenLight">
                        <span className="text-xs text-green">✓</span>
                        <span className="text-xs font-bold text-green">{p.score}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md" style={{ backgroundColor: cat.bg, color: cat.text }}>
                      {p.category}
                    </span>
                    <span className="text-xs text-muted">· {p.read_time}</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
