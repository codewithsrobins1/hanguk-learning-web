'use client';

type FlipCardProps = {
  front: React.ReactNode;
  back: React.ReactNode;
  flipped: boolean;
  onFlip: () => void;
  height?: number;
  className?: string;
};

export default function FlipCard({
  front,
  back,
  flipped,
  onFlip,
  height = 290,
  className = '',
}: FlipCardProps) {
  return (
    <div
      className={`flip-card-container w-full ${className}`}
      style={{ height }}
      onClick={onFlip}
    >
      <div
        className={`flip-card-inner ${flipped ? 'flipped' : ''}`}
        style={{ height }}
      >
        <div className="flip-card-face" style={{ height }}>
          {front}
        </div>
        <div className="flip-card-face flip-card-back" style={{ height }}>
          {back}
        </div>
      </div>
    </div>
  );
}
