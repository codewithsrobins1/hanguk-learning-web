// One-time (or repeatable) seed: copies CONTENT collections from the prod
// Firestore project into the QA Firestore project, 1:1. Deliberately never
// touches user-specific collections (profiles, user_*_progress, placement/
// topik attempts, milestone_results) — QA starts with an empty user table,
// so real user data never leaves prod and new QA signups stay isolated.
const fs = require('fs');
const path = require('path');
const os = require('os');
const admin = require('firebase-admin');

const SOURCE_PROJECT = 'hanguk-learning-app';
const TARGET_PROJECT = 'hanguk-learning-qa';

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

// Reuses the currently logged-in `firebase login` session (via the Firebase
// CLI's own public OAuth client) instead of requiring a separate service
// account key per project. Run `firebase login` first if this errors.
// The underlying @google-cloud/firestore client only reads ADC from a file
// on disk (GOOGLE_APPLICATION_CREDENTIALS), so we materialize one here.
function useFirebaseToolsAdc() {
  const configPath = path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json');
  const { tokens } = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const adc = {
    client_id: '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com',
    client_secret: 'j9iVZfS8kkCEFUPaAeJV0sAi',
    refresh_token: tokens.refresh_token,
    type: 'authorized_user',
  };
  const adcPath = path.join(os.tmpdir(), 'hanguk-seed-adc.json');
  fs.writeFileSync(adcPath, JSON.stringify(adc));
  process.env.GOOGLE_APPLICATION_CREDENTIALS = adcPath;
  return adcPath;
}

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
  const adcPath = useFirebaseToolsAdc();
  const credential = admin.credential.applicationDefault();

  const sourceApp = admin.initializeApp({ credential, projectId: SOURCE_PROJECT }, 'source');
  const targetApp = admin.initializeApp({ credential, projectId: TARGET_PROJECT }, 'target');
  const sourceDb = sourceApp.firestore();
  const targetDb = targetApp.firestore();

  console.log(`Seeding ${TARGET_PROJECT} from ${SOURCE_PROJECT} (content collections only)...\n`);
  let total = 0;
  for (const name of CONTENT_COLLECTIONS) {
    total += await copyCollection(sourceDb, targetDb, name);
  }
  console.log(`\nDone — ${total} documents copied. No user-specific collections were touched.`);
  fs.rmSync(adcPath, { force: true });
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
