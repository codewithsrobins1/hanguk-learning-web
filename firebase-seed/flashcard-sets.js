// ─── FLASHCARD SETS ────────────────────────────────────────────
// To add a new set, copy one of the objects below and update:
//   id         → unique key, e.g. 'set_emotions'
//   title      → display name shown in the app
//   icon       → emoji or Korean character
//   category   → groups the set under a filter pill
//   sort_order → controls display order (increment from last)

const flashcardSets = [
  {
    id: 'set_verbs',
    title: 'Top 50 Basic Verbs',
    icon: '가',
    category: 'Verbs',
    sort_order: 1,
  },
  {
    id: 'set_nouns',
    title: 'Essential Nouns',
    icon: '명',
    category: 'Nouns',
    sort_order: 2,
  },
  {
    id: 'set_food',
    title: 'Food & Drink',
    icon: '🍜',
    category: 'Food',
    sort_order: 3,
  },
  {
    id: 'set_kpop',
    title: 'K-Pop & Music',
    icon: '🎵',
    category: 'Music',
    sort_order: 4,
  },
  {
    id: 'set_travel',
    title: 'Travel Basics',
    icon: '✈️',
    category: 'Travel',
    sort_order: 5,
  },
];

module.exports = { flashcardSets };
