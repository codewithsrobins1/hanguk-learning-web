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
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${pct}%`, backgroundColor: color, height }}
      />
    </div>
  );
}
