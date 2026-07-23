import { ICONS } from '@/assets/icons';

export type NavItem = {
  href: string;
  label: string;
  icon: string;
  enabled: boolean; // default visibility when the user has no saved preference
  premium: boolean; // requires premium to access
  mandatory?: boolean; // cannot be toggled off by the user
};

// Firestore dot-notation update paths can't contain '/', so nav
// preferences are keyed by the href with its leading slash stripped.
export function navPrefKey(href: string) {
  return href.replace(/^\//, '');
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/home', label: 'Home', icon: ICONS.nav.home, enabled: true, premium: false, mandatory: true },
  { href: '/hangul', label: 'Hangul', icon: ICONS.nav.hangul, enabled: true, premium: false },
  { href: '/numbers', label: 'Numbers', icon: ICONS.nav.numbers, enabled: true, premium: false },
  { href: '/cards', label: 'Vocab', icon: ICONS.nav.vocab, enabled: true, premium: false },
  { href: '/read', label: 'Read', icon: ICONS.nav.read, enabled: true, premium: false },
  { href: '/shadow', label: 'Speak', icon: ICONS.nav.speak, enabled: true, premium: false },
  { href: '/listen', label: 'Listen', icon: ICONS.nav.listen, enabled: true, premium: false },
  { href: '/patterns', label: 'Patterns', icon: ICONS.nav.patterns, enabled: true, premium: false },
  { href: '/grammar', label: 'Grammar', icon: ICONS.nav.grammar, enabled: true, premium: false },
  { href: '/tests', label: 'Tests', icon: ICONS.nav.tests, enabled: true, premium: false },
  { href: '/profile', label: 'Profile', icon: ICONS.nav.profile, enabled: true, premium: false, mandatory: true },
];
