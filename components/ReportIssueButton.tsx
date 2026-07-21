'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { reportIssue, IssueReport } from '@/lib/reportIssue';

const REASONS = [
  'Multiple correct answers',
  'Wrong answer marked correct',
  'Typo or translation error',
  'Audio issue',
  'Other',
];

type Props = Omit<IssueReport, 'user_id' | 'reason' | 'details'>;

export default function ReportIssueButton(props: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const reset = () => { setOpen(false); setDone(false); setReason(null); setDetails(''); };

  const handleSubmit = async () => {
    if (!user || !reason) return;
    setSubmitting(true);
    try {
      await reportIssue({
        ...props,
        user_id: user.uid,
        reason,
        details: details.trim() || undefined,
      });
      setDone(true);
      setTimeout(reset, 1400);
    } catch (e) {
      console.error('Failed to report issue:', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted hover:text-ink transition-colors"
      >
        <span>🚩</span> Report issue
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center px-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          onClick={() => !submitting && reset()}
        >
          <div className="bg-white w-full max-w-sm rounded-3xl p-6" onClick={(e) => e.stopPropagation()}>
            {done ? (
              <div className="text-center py-4">
                <p className="text-3xl mb-2">✅</p>
                <p className="font-quicksand font-bold text-ink text-base">Thanks — reported!</p>
              </div>
            ) : (
              <>
                <p className="font-quicksand font-bold text-ink text-lg mb-1">Report a problem</p>
                <p className="text-xs text-muted mb-4">Flag this question if something looks wrong — we'll review it.</p>

                <div className="flex flex-col gap-2 mb-4">
                  {REASONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReason(r)}
                      className="text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        background: reason === r ? '#1A1F36' : '#F7F4EE',
                        color: reason === r ? '#F7F4EE' : '#444',
                        border: '2px solid',
                        borderColor: reason === r ? '#1A1F36' : '#E8E3D8',
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Any extra detail? (optional)"
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-border bg-cream text-sm outline-none mb-4 resize-none"
                />

                <button
                  onClick={handleSubmit}
                  disabled={!reason || submitting}
                  className="btn-press-orange w-full bg-orange text-white py-3 rounded-2xl font-quicksand font-bold text-sm mb-2 disabled:opacity-40"
                >
                  {submitting ? 'Sending...' : 'Submit report'}
                </button>
                <button onClick={reset} className="w-full py-2 text-xs text-muted">Cancel</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
