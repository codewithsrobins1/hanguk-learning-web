const admin = require('firebase-admin');
const sa = require('../serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();

async function run() {
  const snap = await db.collection('profiles').get();
  for (const doc of snap.docs) {
    if (doc.data().goals === undefined) {
      await doc.ref.update({ goals: null });
      console.log('updated', doc.id);
    }
  }
  console.log('done');
  process.exit(0);
}
run();
