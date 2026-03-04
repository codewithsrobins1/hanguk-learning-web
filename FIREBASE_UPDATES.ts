/**
 * ═══════════════════════════════════════════════════════════════
 * HANGUK — Firebase Update Guide
 * ═══════════════════════════════════════════════════════════════
 *
 * This file is a reference guide — not executable code.
 * It covers two areas:
 *
 *   1. CONTENT UPDATES  → adding new cards, passages, questions
 *   2. USER UPDATES     → managing users via Firebase Console
 *
 * ═══════════════════════════════════════════════════════════════
 */


// ───────────────────────────────────────────────────────────────
// PART 1 — ADDING NEW CONTENT
// ───────────────────────────────────────────────────────────────
//
// All content lives in the firebase-seed/ directory.
// Edit the relevant file, then run the seed runner.
//
//   firebase-seed/
//     flashcard-sets.js   ← add new sets here
//     flashcards.js       ← add new cards here
//     passages.js         ← add new passages here
//     questions.js        ← add new quiz questions here
//     index.js            ← runner (don't edit)
//
// ── Step 1: Add your content ───────────────────────────────────
//
// EXAMPLE — New flashcard set in flashcard-sets.js:
//
//   {
//     id: 'set_emotions',       // unique, no spaces
//     title: 'Emotions',        // shown in app
//     icon: '😊',               // emoji or Korean char
//     category: 'Emotions',     // used for filter pills
//     sort_order: 6,            // increment from last
//   },
//
// EXAMPLE — New cards in flashcards.js:
//
//   {
//     id: 'card_e1',            // unique, no spaces
//     set_id: 'set_emotions',   // must match a set id
//     sentence_parts: ['저는 ', '행복해요', '.'],
//     key_index: 1,             // index of the highlighted word
//     translation: 'I am happy.',
//     sort_order: 1,
//   },
//
// EXAMPLE — New passage in passages.js:
//
//   {
//     id: 'passage_market',
//     title: '시장에서',
//     title_en: 'At the Market',
//     category: 'Daily Life',
//     read_time: '3 min read',
//     sort_order: 5,            // increment from last
//     lines: [
//       { korean: '시장에 갔어요.', translation: 'I went to the market.' },
//       { korean: '과일이 신선해요.', translation: 'The fruit is fresh.' },
//     ],
//   },
//
// EXAMPLE — New questions in questions.js:
//
//   {
//     id: 'q_market_1',
//     passage_id: 'passage_market',  // must match a passage id
//     question: '어디에 갔어요?',
//     question_translated: 'Where did they go?',
//     options: ['카페', '시장', '학교', '공원'],
//     options_translated: ['Café', 'Market', 'School', 'Park'],
//     answer_index: 1,               // 0-based index of correct answer
//     sort_order: 1,
//   },
//
// ── Step 2: Run the seed ───────────────────────────────────────
//
//   node firebase-seed/index.js
//
// That's it. The app fetches fresh content from Firestore on load
// so all users see the new content immediately — no deploy needed.
//
// ── ID naming conventions ──────────────────────────────────────
//
//   Flashcard sets  → set_{category}        e.g. set_emotions
//   Flashcards      → card_{initial}{n}     e.g. card_e1, card_e2
//   Passages        → passage_{topic}       e.g. passage_market
//   Questions       → q_{topic}_{n}         e.g. q_market_1
//
// ── Rules ──────────────────────────────────────────────────────
//
//   - IDs must be unique across their collection
//   - Never reuse an ID — it will overwrite the existing document
//   - sort_order controls display order — always increment from last
//   - Each passage needs at least 2 questions
//   - Keep exactly 4 options per question (matches the 2x2 grid)
//   - A card's set_id must exist in flashcard-sets.js
//   - A question's passage_id must exist in passages.js


// ───────────────────────────────────────────────────────────────
// PART 2 — MANAGING USERS
// ───────────────────────────────────────────────────────────────
//
// All user management is done in the Firebase Console.
// Go to: https://console.firebase.google.com → your project
//
// ── View / delete a user ───────────────────────────────────────
//
//   Firebase Console → Authentication → Users tab
//   - Search by email
//   - Click the ⋮ menu to disable or delete the account
//   - Deleting from Auth does NOT delete Firestore data (see below)
//
// ── Delete a user's Firestore data ────────────────────────────
//
//   Firebase Console → Firestore Database → Data tab
//
//   Delete these documents using the user's UID (found in Auth tab):
//
//     /profiles/{uid}
//
//     /user_card_progress/
//       → filter where user_id == {uid} and delete each doc
//
//     /user_passage_progress/
//       → filter where user_id == {uid} and delete each doc
//
// ── Reset a user's streak ──────────────────────────────────────
//
//   Firestore → /profiles/{uid} → Edit fields:
//     current_streak  → 0
//     longest_streak  → 0
//     last_active_date → (delete the field or set to yesterday's date)
//
// ── Reset a user's card progress ──────────────────────────────
//
//   Firestore → /user_card_progress/
//   Filter: user_id == {uid}
//   Delete each document to reset their known/learning status.
//
// ── Reset a user's passage progress ───────────────────────────
//
//   Firestore → /user_passage_progress/
//   Filter: user_id == {uid}
//   Delete each document to allow them to retake quizzes.
//
// ── Change a user's display name or username ───────────────────
//
//   Firestore → /profiles/{uid} → Edit fields:
//     display_name → new value
//     username     → new value
//
// ── View all users and their stats ────────────────────────────
//
//   Firestore → /profiles/
//   Each document is one user. Fields visible at a glance:
//     username, current_streak, longest_streak, last_active_date
//
// ── Export user data ───────────────────────────────────────────
//
//   Firebase Console → Firestore → top right ⋮ → Export
//   Or use the Firebase Admin SDK for programmatic exports.
//
// ───────────────────────────────────────────────────────────────
