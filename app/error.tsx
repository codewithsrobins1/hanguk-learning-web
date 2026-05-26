'use client';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Nav bar */}
      <div
        style={{ background: '#1A1F36' }}
        className="flex items-center justify-between px-5 py-3.5"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-red rounded-lg flex items-center justify-center flex-shrink-0">
            <span
              className="text-white text-sm font-bold"
              style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
            >
              한
            </span>
          </div>
          <span className="font-quicksand font-bold text-cream text-base tracking-tight">
            Hanguk
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 text-center">
        {/* Faded Korean background text */}
        <p
          className="font-bold select-none pointer-events-none absolute"
          style={{
            fontFamily: 'Noto Sans KR, sans-serif',
            fontSize: 96,
            color: '#E8412C',
            opacity: 0.06,
            letterSpacing: -4,
            lineHeight: 1,
          }}
        >
          아이고
        </p>

        {/* Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-red rounded-3xl flex items-center justify-center mx-auto shadow-sm">
            <span className="text-4xl">⚠️</span>
          </div>
        </div>

        {/* Text */}
        <h1 className="font-quicksand font-bold text-ink text-2xl mb-2">
          Something went wrong
        </h1>
        <p className="text-muted text-sm mb-1">
          We hit an unexpected error on our end.
        </p>
        <p
          className="text-sm mb-8"
          style={{ color: '#bbb', fontFamily: 'Noto Sans KR, sans-serif' }}
        >
          문제가 발생했습니다
        </p>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap justify-center mb-8">
          <button
            onClick={reset}
            className="btn-press-navy flex items-center gap-2 bg-navy text-cream px-6 py-3 rounded-2xl font-quicksand font-bold text-sm"
          >
            🔄 Try again
          </button>
          <a
            href="/home"
            className="flex items-center gap-2 bg-white text-ink border-2 border-border px-6 py-3 rounded-2xl font-bold text-sm hover:bg-cream transition-colors"
          >
            ← Go home
          </a>
        </div>

        {/* Error detail */}
        {error.digest && (
          <p className="text-[11px] text-muted">
            Error ID: <span className="font-mono">{error.digest}</span>
          </p>
        )}
        <p className="text-[11px] text-muted mt-1">
          If this keeps happening, try refreshing or clearing your browser
          cache.
        </p>

        {/* Korean vocabulary — on brand */}
        <div className="flex gap-2 flex-wrap justify-center mt-10">
          {[
            { ko: '오류', en: 'error' },
            { ko: '다시', en: 'again' },
            { ko: '괜찮아요', en: "it's okay" },
          ].map(({ ko, en }) => (
            <div key={ko} className="flex flex-col items-center">
              <span
                className="bg-white border border-border rounded-full px-4 py-1.5 text-xs font-bold text-ink"
                style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
              >
                {ko}
              </span>
              <span className="text-[10px] text-muted mt-1">{en}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
