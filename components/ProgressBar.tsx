'use client';
import { motion } from 'framer-motion';

type ProgressBarProps = {
  progress: number;
  color?: string;
  height?: number;
  className?: string;
};

export default function ProgressBar({
  progress,
  color = '#E8412C',
  height = 3,
  className = '',
}: ProgressBarProps) {
  const pct = Math.min(Math.max(progress, 0), 1) * 100;
  return (
    <div
      className={`rounded-full overflow-hidden bg-border ${className}`}
      style={{ height }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color, height }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
      />
    </div>
  );
}
