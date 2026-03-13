// ─── CHANGELOG ─────────────────────────────────────────────────
// Add a new entry here each time you add content, then re-run:
//   node firebase-seed/index.js
//
// Fields:
//   id          → unique, format: 'update_YYYY_MM_DD_slug'
//   date        → 'YYYY-MM-DD'
//   section     → display name shown in the app
//   icon        → emoji matching the section
//   description → one plain-English sentence of what changed

const updates = [
  {
    id: 'update_2026_03_13_dialogues',
    date: '2026-03-13',
    section: 'Shadowing',
    icon: '💬',
    description: '53 dialogues added across Greetings, Food, Shopping, Work, Travel and more',
  },
  {
    id: 'update_2026_03_13_flashcards',
    date: '2026-03-13',
    section: 'Flashcards',
    icon: '⧉',
    description: '5 new sets added — Emotions, Numbers, Time, Health, Adjectives',
  },
  {
    id: 'update_2026_03_13_passages',
    date: '2026-03-13',
    section: 'Reading',
    icon: '≡',
    description: '26 new passages added across Daily Life, Food, Travel, Music, Study and Culture',
  },
];

module.exports = { updates };
