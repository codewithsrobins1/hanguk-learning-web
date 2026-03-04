'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const navItems = [
  { href: '/home', label: 'Home', icon: '⌂' },
  { href: '/hangul', label: 'Hangul', icon: '가' },
  { href: '/cards', label: 'Flashcards', icon: '⧉' },
  { href: '/read', label: 'Reading', icon: '≡' },
  { href: '/profile', label: 'Profile', icon: '◎' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p
          className="text-3xl animate-pulse"
          style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
        >
          한국
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-56 min-h-screen bg-white border-r border-border px-4 py-6 fixed left-0 top-0 bottom-0">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-9 h-9 bg-navy rounded-xl flex items-center justify-center">
            <span
              className="text-cream text-base font-bold"
              style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
            >
              한
            </span>
          </div>
          <span className="font-extrabold text-ink text-lg">Hanguk</span>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors
                  ${active ? 'bg-ink text-cream' : 'text-inkLight hover:bg-cream'}`}
              >
                <span className="text-lg w-6 text-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-56 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>

      {/* Bottom nav — mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border flex z-50">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors
                ${active ? 'text-ink' : 'text-muted'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
