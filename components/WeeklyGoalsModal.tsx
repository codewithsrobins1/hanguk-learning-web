'use client';
import { useEffect, useRef, useState } from 'react';
import { WEEKLY_CATEGORIES, weeklyGoals, type WeeklyGoals } from '@/lib/weekly-goals';

export default function WeeklyGoalsModal({ initial, onSave, onClose }: {
  initial: WeeklyGoals; onSave: (goals: WeeklyGoals) => Promise<void>; onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState(initial);
  const [values, setValues] = useState(() => Object.fromEntries(WEEKLY_CATEGORIES.map(c => [c.key, String(initial[c.key].target)])));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const node = dialog.current!;
    const previous = document.activeElement as HTMLElement | null;
    node.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { node.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (saving) return;
    const next = weeklyGoals(draft);
    for (const { key } of WEEKLY_CATEGORIES) {
      const parsed = Number(values[key]);
      const value = !draft[key].enabled && (!Number.isInteger(parsed) || parsed < 1 || parsed > 999)
        ? draft[key].target : parsed;
      if (!Number.isInteger(value) || value < 1 || value > 999) { setError('Enter whole-number goals from 1 to 999.'); return; }
      next[key].target = value;
    }
    setError(''); setSaving(true);
    try { await onSave(next); onClose(); }
    catch { setError('Could not save your goals. Please try again.'); setSaving(false); }
  };
  return (
    <dialog ref={dialog} aria-labelledby="weekly-goals-title" onCancel={event => { event.preventDefault(); if (!saving) onClose(); }}
      className="m-auto w-[calc(100%-2rem)] max-w-md max-h-[90dvh] overflow-y-auto rounded-3xl bg-white p-6 text-ink backdrop:bg-black/60">
      <form onSubmit={submit}>
        <h2 id="weekly-goals-title" className="font-quicksand font-bold text-xl">Weekly goals</h2>
        <p className="text-sm text-muted mt-2 mb-5">Choose what to track and set your weekly targets. Changing goals keeps your progress.</p>
        <fieldset disabled={saving} className="space-y-4">
          {WEEKLY_CATEGORIES.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button type="button" role="switch" aria-checked={draft[key].enabled} aria-label={`Track ${label}`}
                  onClick={() => setDraft({ ...draft, [key]: { ...draft[key], enabled: !draft[key].enabled } })}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange ${draft[key].enabled ? 'bg-navy' : 'bg-border'}`}>
                  <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${draft[key].enabled ? 'translate-x-5' : ''}`} />
                </button>
                <label htmlFor={`weekly-${key}`} className="text-sm font-semibold">{label}</label>
              </div>
              <div className="flex items-center gap-2">
                <input id={`weekly-${key}`} type="number" inputMode="numeric" min="1" max="999" step="1" required disabled={!draft[key].enabled}
                  value={values[key]} onChange={e => setValues({ ...values, [key]: e.target.value })}
                  className="w-16 rounded-xl border-2 border-border p-2 text-center text-sm focus:border-orange outline-none disabled:opacity-40" />
                <span className="w-12 text-xs text-muted">{key === 'cards' ? 'cards' : 'lessons'}</span>
              </div>
            </div>
          ))}
          <p className="text-xs text-muted">Repeated lesson completions count. Tracking choices do not change your navigation.</p>
          <button type="button" className="text-sm font-semibold underline" onClick={() => {
            const defaults = weeklyGoals(); setDraft(defaults);
            setValues(Object.fromEntries(WEEKLY_CATEGORIES.map(c => [c.key, String(defaults[c.key].target)]))); setError('');
          }}>Restore defaults</button>
        </fieldset>
        {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
        <div className="mt-6 flex gap-3">
          <button type="button" disabled={saving} onClick={onClose} className="flex-1 rounded-xl border-2 border-border py-3 font-bold text-sm">Cancel</button>
          <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-orange text-white py-3 font-bold text-sm disabled:opacity-50">{saving ? 'Saving…' : 'Save goals'}</button>
        </div>
      </form>
    </dialog>
  );
}
