'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { NAV_ITEMS, NavItem } from '@/lib/nav-config';
import { ICONS } from '@/assets/icons';
import LevelUpOverlay from '@/components/LevelUpOverlay';

function NavLink({
  item,
  active,
  locked,
  mobile,
}: {
  item: NavItem;
  active: boolean;
  locked: boolean;
  mobile?: boolean;
}) {
  const baseClass = mobile
    ? 'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all'
    : 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all';
  const inactiveClass = mobile
    ? 'text-white/55 hover:bg-white/8 hover:text-white/80'
    : 'text-white/50 hover:bg-white/8 hover:text-white/80';
  const stateClass = active
    ? 'bg-white/15 text-white'
    : locked
      ? 'text-white/30 cursor-not-allowed'
      : inactiveClass;

  const content = (
    <>
      <span className="text-lg w-6 text-center">{item.icon}</span>
      {item.label}
      {locked && <span className="ml-auto text-xs">{ICONS.ui.lock}</span>}
    </>
  );

  if (locked) {
    return <div className={`${baseClass} ${stateClass}`}>{content}</div>;
  }
  return (
    <Link href={item.href} className={`${baseClass} ${stateClass}`}>
      {content}
    </Link>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  if (loading || !user)
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

  const isPremiumUser = profile?.premium !== false;
  const visibleItems = NAV_ITEMS.filter(
    (item) => item.mandatory || (profile?.nav_preferences?.[item.href] ?? item.enabled)
  );

  return (
    <div className="flex min-h-screen bg-cream">
      {/* ── Desktop sidebar ───────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen bg-navy fixed left-0 top-0 bottom-0 z-40 px-4 py-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-9 h-9 bg-red rounded-xl flex items-center justify-center flex-shrink-0">
            <span
              className="text-white text-base font-bold"
              style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
            >
              한
            </span>
          </div>
          <span className="font-quicksand font-bold text-cream text-lg tracking-tight">
            Hanguk
          </span>
        </div>
        {/* Nav items */}
        <nav className="flex flex-col gap-1 flex-1">
          {visibleItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + '/');
            const locked = item.premium && !isPremiumUser;
            return <NavLink key={item.href} item={item} active={active} locked={locked} />;
          })}
        </nav>
      </aside>

      {/* ── Mobile top bar ────────────────────────────────────── */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-40 bg-navy flex items-center justify-between px-5"
        style={{ height: 56 }}
      >
        <Link href="/home" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-red rounded-lg flex items-center justify-center">
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
        </Link>
        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Open menu"
          className="flex flex-col gap-[5px] p-2 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <span className="block w-5 h-[2px] bg-cream rounded-full" />
          <span className="block w-3.5 h-[2px] bg-cream rounded-full" />
          <span className="block w-5 h-[2px] bg-cream rounded-full" />
        </button>
      </div>

      {/* ── Mobile slide-out menu ─────────────────────────────── */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-50 menu-fade-in"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setMenuOpen(false)}
          />
          {/* Menu panel */}
          <div className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-navy flex flex-col menu-slide-in">
            {/* Menu header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Link href="/home" className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-red rounded-lg flex items-center justify-center">
                  <span
                    className="text-white text-sm font-bold"
                    style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
                  >
                    한
                  </span>
                </div>
                <span className="font-quicksand font-bold text-cream text-base">
                  Hanguk
                </span>
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white text-lg transition-colors"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                ✕
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
              {visibleItems.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + '/');
                const locked = item.premium && !isPremiumUser;
                return <NavLink key={item.href} item={item} active={active} locked={locked} mobile />;
              })}
            </nav>
          </div>
        </>
      )}

      {/* ── Main content ──────────────────────────────────────── */}
      <main className="flex-1 md:ml-60 min-h-screen pt-14 md:pt-0">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>

      <LevelUpOverlay />
    </div>
  );
}
