// One-time (or repeatable) seed: copies CONTENT collections from the prod
// Firestore project into the QA Firestore project, 1:1. Deliberately never
// touches user-specific collections (profiles, user_*_progress, placement/
// topik attempts, milestone_results) — QA starts with an empty user table,
// so real user data never leaves prod and new QA signups stay isolated.
const { getDb, cleanupAdc } = require('./lib/firebaseAdmin');

const CONTENT_COLLECTIONS = [
  'changelog',
  'comprehension_questions',
  'dialogues',
  'flashcard_sets',
  'flashcards',
  'grammar_lessons',
  'grammar_questions',
  'listening_exercises',
  'passages',
  'patterns',
  'topik_tests',
];

async function copyCollection(sourceDb, targetDb, name) {
  const snap = await sourceDb.collection(name).get();
  if (snap.empty) {
    console.log(`  · ${name}: 0 docs (skipped)`);
    return 0;
  }
  const batchSize = 400;
  const docs = snap.docs;
  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = targetDb.batch();
    for (const d of docs.slice(i, i + batchSize)) {
      batch.set(targetDb.collection(name).doc(d.id), d.data());
    }
    await batch.commit();
  }
  console.log(`  ✓ ${name}: ${docs.length} docs copied`);
  return docs.length;
}

async function main() {
  const sourceDb = getDb('prod');
  const targetDb = getDb('qa');

  console.log(`Seeding QA from prod (content collections only)...\n`);
  let total = 0;
  for (const name of CONTENT_COLLECTIONS) {
    total += await copyCollection(sourceDb, targetDb, name);
  }
  console.log(`\nDone — ${total} documents copied. No user-specific collections were touched.`);
  cleanupAdc();
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
