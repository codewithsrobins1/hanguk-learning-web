const admin = require('firebase-admin');
const sa    = require('../serviceAccountKey.json');
const data  = require('../listening-exercises.json');

admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();

async function run() {
  console.log(`Seeding ${data.length} listening exercises...`);
  const batch = db.batch();
  for (const ex of data) {
    const ref = db.collection('listening_exercises').doc(ex.id);
    batch.set(ref, ex);
  }
  await batch.commit();
  console.log('✅ Listening exercises seeded!');
  process.exit(0);
}
run();
