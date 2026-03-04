/**
 * HANGUK — Firebase Seed Runner
 * ─────────────────────────────────────────────────────────────
 * Imports all content from the firebase-seed/ directory and
 * pushes it to Firestore in a single batched write.
 *
 * SETUP (one time):
 *   1. npm install firebase-admin
 *   2. Firebase Console → Project Settings → Service Accounts
 *      → Generate new private key → save as serviceAccountKey.json
 *      in the same folder as this file
 *
 * RUN:
 *   node firebase-seed/index.js
 *
 * SAFE TO RE-RUN: Uses setDoc with merge:true so existing user
 * progress (streaks, card progress, quiz scores) is never touched.
 * ─────────────────────────────────────────────────────────────
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

const { flashcardSets } = require('./flashcard-sets');
const { flashcards }    = require('./flashcards');
const { passages }      = require('./passages');
const { questions }     = require('./questions');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function seed() {
  const batch = db.batch();

  // ── Flashcard Sets ──────────────────────────────────────────
  console.log(`📚 Seeding ${flashcardSets.length} flashcard sets...`);
  for (const set of flashcardSets) {
    const { id, ...data } = set;
    batch.set(
      db.collection('flashcard_sets').doc(id),
      { ...data, card_count: 0 },
      { merge: true }
    );
  }

  // ── Flashcards ──────────────────────────────────────────────
  console.log(`🃏 Seeding ${flashcards.length} flashcards...`);
  for (const card of flashcards) {
    const { id, ...data } = card;
    batch.set(db.collection('flashcards').doc(id), data, { merge: true });
  }

  // ── Passages ────────────────────────────────────────────────
  console.log(`📖 Seeding ${passages.length} passages...`);
  for (const passage of passages) {
    const { id, ...data } = passage;
    batch.set(db.collection('passages').doc(id), data, { merge: true });
  }

  // ── Comprehension Questions ─────────────────────────────────
  console.log(`❓ Seeding ${questions.length} questions...`);
  for (const q of questions) {
    const { id, ...data } = q;
    batch.set(db.collection('comprehension_questions').doc(id), data, { merge: true });
  }

  await batch.commit();

  // ── Update card counts per set ──────────────────────────────
  console.log('🔢 Updating card counts...');
  for (const set of flashcardSets) {
    const snap = await db
      .collection('flashcards')
      .where('set_id', '==', set.id)
      .count()
      .get();
    await db
      .collection('flashcard_sets')
      .doc(set.id)
      .update({ card_count: snap.data().count });
  }

  console.log('✅ Seed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
