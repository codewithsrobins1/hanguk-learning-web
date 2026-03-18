'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useUserStats } from '@/hooks/useUserStats';
import { sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import ProgressBar from '@/components/ProgressBar';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { stats } = useUserStats();

  const [editingName, setEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(
    profile?.display_name || profile?.username || ''
  );
  const [resetSent, setResetSent] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveName = async () => {
    if (!user || !displayName.trim()) return;
    setSaving(true);
    const { updateDoc, doc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'profiles', user.uid), {
      display_name: displayName.trim(),
    });
    await refreshProfile();
    setSaving(false);
    setEditingName(false);
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    await sendPasswordResetEmail(auth, user.email);
    setResetSent(true);
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    await deleteDoc(doc(db, 'profiles', user.uid));
    await deleteUser(user);
    router.replace('/login');
  };

  return (
    <div className="max-w-xl mx-auto px-7 py-8">
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-2xl bg-navy flex items-center justify-center flex-shrink-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#F7F4EE"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Settings</h1>
          <p className="text-s text-muted">Manage your account</p>
        </div>
      </div>

      {/* ── Identity ─────────────────────────────────────────── */}
      <p className="text-[11px] font-bold text-muted tracking-widest mb-2">
        IDENTITY
      </p>
      <div className="bg-white rounded-2xl border border-border overflow-hidden mb-6">
        {/* Display name */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-muted tracking-wider mb-0.5">
              DISPLAY NAME
            </p>
            {editingName ? (
              <input
                autoFocus
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                className="text-sm font-bold text-ink bg-cream rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-navy"
              />
            ) : (
              <p className="text-sm font-bold text-ink">
                {profile?.display_name || profile?.username || 'Learner'}
              </p>
            )}
          </div>
          {editingName ? (
            <button
              onClick={handleSaveName}
              disabled={saving}
              className="ml-3 text-xs font-bold px-3 py-1.5 rounded-lg bg-navy text-cream flex-shrink-0"
            >
              {saving ? '...' : 'Save'}
            </button>
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="ml-3 text-xs font-semibold text-muted hover:text-ink transition-colors flex-shrink-0"
            >
              Edit
            </button>
          )}
        </div>

        {/* Username */}
        <div className="px-4 py-3.5 border-b border-border">
          <p className="text-[10px] font-bold text-muted tracking-wider mb-0.5">
            USERNAME
          </p>
          <p className="text-sm font-bold text-ink">
            @{profile?.username || '—'}
          </p>
        </div>

        {/* Email */}
        <div className="px-4 py-3.5">
          <p className="text-[10px] font-bold text-muted tracking-wider mb-0.5">
            EMAIL
          </p>
          <p className="text-sm font-bold text-ink">{user?.email || '—'}</p>
        </div>
      </div>

      {/* ── XP & Level ───────────────────────────────────────── */}
      <p className="text-[11px] font-bold text-muted tracking-widest mb-2">
        PROGRESS
      </p>
      <div className="bg-white rounded-2xl border border-border p-4 mb-6">
        {/* XP bar */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base">⚡</span>
            <span className="text-sm font-bold text-ink">
              Level {stats.level}
            </span>
            <span className="text-[11px] text-muted">
              → Level {stats.level + 1}
            </span>
          </div>
          <span className="text-[11px] text-muted">
            {stats.xpIntoLevel} / {stats.xpNeeded} XP
          </span>
        </div>
        <div
          className="rounded-full overflow-hidden mb-1"
          style={{ background: '#F7F4EE', height: 10 }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.round(stats.xpProgress * 100)}%`,
              background: '#1A1F36',
            }}
          />
        </div>
        <p className="text-[11px] text-muted mb-4">
          {stats.xpNeeded - stats.xpIntoLevel} XP to level up · {stats.xp} XP
          total
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-cream rounded-xl p-3">
            <p className="text-[10px] font-bold text-muted tracking-wider mb-1">
              VOCAB
            </p>
            <p className="text-xl font-extrabold text-ink mb-0.5">
              {stats.cardsKnown}
              <span className="text-xs font-semibold text-muted">
                {' '}
                / {stats.totalCards}
              </span>
            </p>
            <p className="text-[10px] text-muted mb-2">cards known</p>
            <ProgressBar
              progress={
                stats.totalCards > 0 ? stats.cardsKnown / stats.totalCards : 0
              }
              color="#E8412C"
            />
          </div>
          <div className="bg-cream rounded-xl p-3">
            <p className="text-[10px] font-bold text-muted tracking-wider mb-1">
              READING
            </p>
            <p className="text-xl font-extrabold text-ink mb-0.5">
              {stats.passagesDone}
              <span className="text-xs font-semibold text-muted">
                {' '}
                / {stats.totalPassages}
              </span>
            </p>
            <p className="text-[10px] text-muted mb-2">passages done</p>
            <ProgressBar
              progress={
                stats.totalPassages > 0
                  ? stats.passagesDone / stats.totalPassages
                  : 0
              }
              color="#3B82F6"
            />
          </div>
        </div>
      </div>

      {/* ── Account ──────────────────────────────────────────── */}
      <p className="text-[11px] font-bold text-muted tracking-widest mb-2">
        ACCOUNT
      </p>
      <div className="bg-white rounded-2xl border border-border overflow-hidden mb-6">
        <div className="px-4 py-3.5">
          <p className="text-[10px] font-bold text-muted tracking-wider mb-1">
            PASSWORD
          </p>
          {resetSent ? (
            <p className="text-sm font-bold text-green">
              Reset email sent! Check your inbox ✓
            </p>
          ) : (
            <button
              onClick={handleResetPassword}
              className="text-sm font-bold text-navy hover:underline transition-colors"
            >
              Send password reset email →
            </button>
          )}
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="w-full py-3.5 rounded-xl font-bold text-sm text-cream transition-opacity hover:opacity-90 mb-3"
        style={{ background: '#1A1F36' }}
      >
        Sign Out
      </button>

      {/* Delete account */}
      <button
        onClick={() => setShowDeleteModal(true)}
        className="w-full py-3.5 rounded-xl border-[1.5px] border-red font-bold text-sm text-red hover:bg-red hover:text-white transition-colors"
      >
        Delete Account
      </button>

      {/* ── Delete confirmation modal ─────────────────────────── */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-extrabold text-ink mb-2">
              Delete account?
            </h2>
            <p className="text-sm text-muted mb-4 leading-relaxed">
              This will permanently delete your account and all progress. This
              cannot be undone. Type{' '}
              <span className="font-bold text-ink">DELETE</span> to confirm.
            </p>
            <input
              type="text"
              placeholder="Type DELETE to confirm"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border text-sm font-bold focus:outline-none focus:border-red mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm('');
                }}
                className="flex-1 py-3 rounded-xl border border-border font-bold text-sm text-ink hover:bg-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE'}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-colors disabled:opacity-40"
                style={{ background: '#E8412C' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
