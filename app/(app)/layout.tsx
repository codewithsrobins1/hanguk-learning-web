'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const sidebarItems = [
  { href: '/home', label: 'Home', icon: '⌂' },
  { href: '/hangul', label: 'Hangul', icon: '가' },
  { href: '/cards', label: 'Flashcards', icon: '⧉' },
  { href: '/read', label: 'Read', icon: '≡' },
  { href: '/shadow', label: 'Speak', icon: '💬' },
  { href: '/profile', label: 'Profile', icon: '⚙️' },
];

const learnItems = [
  { href: '/hangul', label: 'Hangul', icon: '가' },
  { href: '/cards', label: 'Cards', icon: '⧉' },
  { href: '/read', label: 'Read', icon: '≡' },
  { href: '/shadow', label: 'Speak', icon: '💬' },
];

const learnPaths = learnItems.map((i) => i.href);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [learnOpen, setLearnOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  // Close learn menu on navigation
  useEffect(() => {
    setLearnOpen(false);
  }, [pathname]);

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

  const isLearnActive = learnPaths.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );

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
          {sidebarItems.map((item) => {
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
      <main className="flex-1 md:ml-56 pb-24 md:pb-0 min-h-screen">
        {children}
      </main>

      {/* ── Bottom nav — mobile ──────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* Learn fan menu — appears above nav */}
        {learnOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setLearnOpen(false)}
            />
            {/* Fan items */}
            <div className="absolute bottom-[72px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-50 pb-1">
              {[...learnItems].reverse().map((item, i) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 pl-4 pr-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg transition-all"
                    style={{
                      background: active ? '#1A1F36' : '#fff',
                      color: active ? '#F7F4EE' : '#111',
                      border: '1.5px solid #E8E3D8',
                      minWidth: 140,
                      animationDelay: `${i * 40}ms`,
                      transform: `translateY(${learnOpen ? 0 : 20}px)`,
                      opacity: learnOpen ? 1 : 0,
                      transition: `transform 0.2s ease ${i * 40}ms, opacity 0.2s ease ${i * 40}ms`,
                    }}
                  >
                    <span className="text-base w-5 text-center">
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* Nav bar */}
        <nav
          className="bg-white border-t border-border flex items-stretch px-8"
          style={{ height: 64 }}
        >
          {/* Home */}
          <NavTab href="/home" label="Home" icon="⌂" pathname={pathname} />

          {/* Learn — center button */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <button
              onClick={() => setLearnOpen((o) => !o)}
              className="flex flex-col items-center justify-center gap-0.5 w-full py-2 transition-colors"
              style={{ color: learnOpen || isLearnActive ? '#111' : '#aaa' }}
            >
              <span
                className="text-xl transition-transform duration-200"
                style={{
                  transform: learnOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                  display: 'block',
                }}
              >
                {learnOpen ? '✕' : '⊕'}
              </span>
              <span className="text-[12px] font-semibold">Learn</span>
            </button>
          </div>

          {/* Profile */}
          <NavTab
            href="/profile"
            label="Profile"
            icon="◎"
            pathname={pathname}
          />
        </nav>
      </div>
    </div>
  );
}

function NavTab({
  href,
  label,
  icon,
  pathname,
}: {
  href: string;
  label: string;
  icon: string;
  pathname: string;
}) {
  const active = pathname === href || pathname.startsWith(href + '/');
  return (
    <Link
      href={href}
      className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors"
      style={{ color: active ? '#111' : '#aaa' }}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-[12px] font-semibold">{label}</span>
    </Link>
  );
}
