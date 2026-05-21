'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const SPECIAL_CHARS    = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
const HAS_NUMBER       = /\d/;
const HTML_SCRIPT_PATTERN = /<[^>]*>|javascript:|on\w+\s*=/i;

function sanitizeInput(value: string) {
  return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function containsInjection(value: string) {
  return HTML_SCRIPT_PATTERN.test(value);
}

type Req = { label: string; met: boolean };

function getRequirements(password: string, confirm: string): Req[] {
  return [
    { label: 'At least 8 characters',      met: password.length >= 8 },
    { label: 'At least 1 number',           met: HAS_NUMBER.test(password) },
    { label: 'At least 1 special character',met: SPECIAL_CHARS.test(password) },
    { label: 'Passwords match',             met: password.length > 0 && password === confirm },
  ];
}

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showReqs, setShowReqs] = useState(false);

  const requirements = getRequirements(password, confirm);
  const allMet = requirements.every(r => r.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !email || !password || !confirm) { setError('Please fill in all fields.'); return; }
    if (containsInjection(username) || containsInjection(email)) { setError('Invalid characters detected.'); return; }
    if (!allMet) { setError('Please meet all password requirements.'); return; }
    setLoading(true);
    const { error: err } = await signUp(sanitizeInput(email.trim().toLowerCase()), password, sanitizeInput(username.trim()));
    setLoading(false);
    if (err) setError(err);
    else router.replace('/home');
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-5 py-10 relative overflow-hidden">

      {/* Blobs */}
      <div className="absolute top-[-8%] right-[-5%] w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'rgba(26,31,54,0.07)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-[-8%] left-[-5%] w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'rgba(232,65,44,0.06)', filter: 'blur(60px)' }} />

      <div className="w-full max-w-sm relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-navy rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg">
            <span className="text-cream text-2xl font-bold" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>한</span>
          </div>
          <h1 className="font-quicksand font-bold text-ink text-3xl mb-1">Create account</h1>
          <p className="text-muted text-sm">Start your Korean journey today</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-7 shadow-sm" style={{ border: '1.5px solid #E8E3D8' }}>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-inkLight mb-2 tracking-wider uppercase">Username</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="seanlee" autoCapitalize="off" autoCorrect="off"
                  className="input-field" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-inkLight mb-2 tracking-wider uppercase">Email</label>
              <div className="input-wrapper">
                <span className="input-icon">✉</span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com" autoCapitalize="off"
                  className="input-field" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-inkLight mb-2 tracking-wider uppercase">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setShowReqs(true)}
                  placeholder="••••••••"
                  className={`input-field ${password.length > 0 && !allMet ? 'input-field-error' : ''}`}
                />
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-xs font-bold text-inkLight mb-2 tracking-wider uppercase">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input type="password" value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className={`input-field ${confirm.length > 0 && password !== confirm ? 'input-field-error' : ''}`}
                />
              </div>
            </div>

            {/* Requirements */}
            {(showReqs || password.length > 0) && (
              <div className="bg-cream rounded-2xl border border-border px-4 py-3 space-y-2">
                {requirements.map(req => (
                  <div key={req.label} className="flex items-center gap-2.5">
                    <span className="text-sm font-bold w-4 text-center transition-colors duration-200"
                      style={{ color: req.met ? '#22C55E' : '#CCC' }}>
                      {req.met ? '✓' : '·'}
                    </span>
                    <span className="text-xs font-medium transition-colors duration-200"
                      style={{ color: req.met ? '#22C55E' : '#888' }}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="text-red text-sm bg-redLight border border-red/20 rounded-xl px-4 py-2.5 font-medium">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading || !allMet}
              className="btn-press w-full bg-navy text-cream py-4 rounded-2xl font-quicksand font-bold text-base mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-red font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
