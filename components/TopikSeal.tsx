'use client';
import { useId } from 'react';

export default function TopikSeal({ level, size = 64 }: { level: number; size?: number }) {
  const arcId = `topikSealArc-${useId()}`;
  const section = level <= 2 ? 'TOPIK I' : 'TOPIK II';

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx={50} cy={50} r={47} fill="none" stroke="#1A1F36" strokeWidth={2} />
        <circle cx={50} cy={50} r={38} fill="none" stroke="#F97316" strokeWidth={1.5} strokeDasharray="3,3" />
        <path id={arcId} d="M 50 50 m -32, 0 a 32,32 0 1,1 64,0" fill="none" />
        <text>
          <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle" style={{ fontSize: 9, fontWeight: 700, fill: '#1A1F36', letterSpacing: '1px' }}>
            {section}
          </textPath>
        </text>
        <text x={50} y={66} textAnchor="middle" style={{ fontFamily: "'Quicksand',sans-serif", fontSize: 32, fontWeight: 700, fill: '#F97316' }}>
          {level}
        </text>
      </svg>
    </div>
  );
}
