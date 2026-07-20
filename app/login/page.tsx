'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import PasswordToggleButton from '@/components/PasswordToggleButton';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) setError(err);
    else router.replace('/home');
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-5 relative overflow-hidden">

      {/* Atmospheric blobs */}
      <div className="absolute top-[-8%] right-[-5%] w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'rgba(26,31,54,0.07)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-[-8%] left-[-5%] w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'rgba(232,65,44,0.06)', filter: 'blur(60px)' }} />

      <div className="w-full max-w-sm relative z-10">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-navy rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg">
            <span className="text-cream text-2xl font-bold" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>한</span>
          </div>
          <h1 className="font-quicksand font-bold text-ink text-3xl mb-1">Welcome back</h1>
          <p className="text-muted text-sm">Good to see you again</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-7 shadow-sm" style={{ border: '1.5px solid #E8E3D8' }}>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-inkLight mb-2 tracking-wider uppercase">Email</label>
              <div className="input-wrapper">
                <span className="input-icon">✉</span>
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="input-field"
                  autoCapitalize="off"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-inkLight mb-2 tracking-wider uppercase">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                  style={{ paddingRight: 48 }}
                />
                <PasswordToggleButton visible={showPw} onToggle={() => setShowPw(p => !p)} />
              </div>
            </div>

            {error && (
              <div className="text-red text-sm bg-redLight border border-red/20 rounded-xl px-4 py-2.5 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="btn-press w-full bg-navy text-cream py-4 rounded-2xl font-quicksand font-bold text-base mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="text-orange font-bold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
