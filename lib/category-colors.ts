// Colored icon-tile palette for category badges/tiles across Vocab, Read,
// Listen, and Patterns hubs. Explicit entries match the design mockup;
// anything else falls back to a deterministic color from FALLBACK_PALETTE
// so new categories never render unstyled.

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#F5820A',
  Travel: '#0F9488',
  Verbs: '#2563EB',
  Nouns: '#7C3AED',
  Music: '#DB2777',
  Greetings: '#1A1F36',
  'Daily Life': '#2563EB',
  'Counting & Numbers': '#0F9488',
  Study: '#7C3AED',
  Gaming: '#DB2777',
  Family: '#F5820A',
  Culture: '#7C3AED',
};

const FALLBACK_PALETTE = ['#2563EB', '#7C3AED', '#DB2777', '#F5820A', '#0F9488', '#1A1F36'];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function categoryColor(category: string): string {
  if (CATEGORY_COLORS[category]) return CATEGORY_COLORS[category];
  return FALLBACK_PALETTE[hashString(category) % FALLBACK_PALETTE.length];
}
