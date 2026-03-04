'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const SPECIAL_CHARS = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
const HAS_NUMBER = /\d/;
const HTML_SCRIPT_PATTERN = /<[^>]*>|javascript:|on\w+\s*=/i;

function sanitizeInput(value: string): string {
  return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function containsInjection(value: string): boolean {
  return HTML_SCRIPT_PATTERN.test(value);
}

type Requirement = { label: string; met: boolean };

function getRequirements(password: string, confirm: string): Requirement[] {
  return [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'At least 1 number', met: HAS_NUMBER.test(password) },
    {
      label: 'At least 1 special character',
      met: SPECIAL_CHARS.test(password),
    },
    {
      label: 'Passwords match',
      met: password.length > 0 && password === confirm,
    },
  ];
}

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReqs, setShowReqs] = useState(false);

  const requirements = getRequirements(password, confirm);
  const allMet = requirements.every((r) => r.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirm) {
      setError('Please fill in all fields.');
      return;
    }

    if (containsInjection(username) || containsInjection(email)) {
      setError('Invalid characters detected in username or email.');
      return;
    }

    if (!allMet) {
      setError('Please meet all password requirements.');
      return;
    }

    const safeUsername = sanitizeInput(username.trim());
    const safeEmail = sanitizeInput(email.trim().toLowerCase());

    setLoading(true);
    const { error: err } = await signUp(safeEmail, password, safeUsername);
    setLoading(false);

    if (err) setError(err);
    else router.replace('/home');
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span
              className="text-cream text-2xl font-bold"
              style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
            >
              한
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-ink">Create account</h1>
          <p className="text-muted text-sm mt-1">
            Start your Korean journey today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-inkLight mb-1.5 uppercase tracking-wide">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="seanlee"
              autoCapitalize="off"
              autoCorrect="off"
              className="w-full px-4 py-3 rounded-xl border-[1.5px] border-border bg-white text-ink text-sm outline-none focus:border-ink transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-inkLight mb-1.5 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              autoCapitalize="off"
              className="w-full px-4 py-3 rounded-xl border-[1.5px] border-border bg-white text-ink text-sm outline-none focus:border-ink transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-inkLight mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setShowReqs(true)}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-xl border-[1.5px] bg-white text-ink text-sm outline-none transition-colors ${
                password.length > 0 && !allMet
                  ? 'border-red'
                  : 'border-border focus:border-ink'
              }`}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-inkLight mb-1.5 uppercase tracking-wide">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-xl border-[1.5px] bg-white text-ink text-sm outline-none transition-colors ${
                confirm.length > 0 && password !== confirm
                  ? 'border-red'
                  : 'border-border focus:border-ink'
              }`}
            />
          </div>

          {/* Live requirements checklist */}
          {(showReqs || password.length > 0) && (
            <div className="bg-white rounded-xl border border-border px-4 py-3 space-y-2">
              {requirements.map((req) => (
                <div key={req.label} className="flex items-center gap-2.5">
                  <span
                    className="text-sm font-bold w-4 text-center transition-all duration-200"
                    style={{ color: req.met ? '#22C55E' : '#BBBBBB' }}
                  >
                    {req.met ? '✓' : '•'}
                  </span>
                  <span
                    className="text-xs font-medium transition-colors duration-200"
                    style={{ color: req.met ? '#22C55E' : '#888888' }}
                  >
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-red text-sm bg-redLight border border-red border-opacity-20 rounded-xl px-4 py-2.5">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !allMet}
            className="w-full bg-ink text-cream py-3.5 rounded-xl font-bold text-sm hover:bg-inkLight transition-colors disabled:opacity-40 mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-red font-bold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
