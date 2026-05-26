require('dotenv').config({ path: '.env.local' });
const OpenAI = require('openai');
const admin = require('firebase-admin');
const sa = require('../serviceAccountKey.json');
const data = require('../listening-exercises.json');
const fs = require('fs');
const path = require('path');
const https = require('https');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
admin.initializeApp({
  credential: admin.credential.cert(sa),
  storageBucket: 'hanguk-learning-app.firebasestorage.app',
});
const db = admin.firestore();
const bucket = admin.storage().bucket(); // uses default bucket

async function generateAudio(text, outputPath) {
  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'nova',
    input: text,
    response_format: 'mp3',
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
}

async function uploadToStorage(localPath, storagePath) {
  await bucket.upload(localPath, {
    destination: storagePath,
    metadata: {
      contentType: 'audio/mpeg',
      cacheControl: 'public, max-age=31536000',
    },
  });
  const file = bucket.file(storagePath);
  await file.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
}

async function main() {
  const tmpDir = './tmp-audio';
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

  let total = 0;
  for (const ex of data) {
    for (const seg of ex.segments) {
      // Build full segment text — all lines concatenated
      const text = seg.lines.map((l) => l.korean).join(' ');
      const fileName = `${ex.id}_seg${seg.segment_index}.mp3`;
      const localPath = path.join(tmpDir, fileName);
      const storagePath = `listening/${ex.id}/${fileName}`;

      console.log(`[${++total}] ${ex.id} segment ${seg.segment_index}`);

      try {
        await generateAudio(text, localPath);
        const url = await uploadToStorage(localPath, storagePath);

        // Update Firestore with audio_url on the segment
        const ref = db.collection('listening_exercises').doc(ex.id);
        const snap = await ref.get();
        if (snap.exists) {
          const segments = snap.data().segments;
          segments[seg.segment_index].audio_url = url;
          await ref.update({ segments });
        }

        fs.unlinkSync(localPath);
        console.log(`  ✓ ${url}`);
        await new Promise((r) => setTimeout(r, 200));
      } catch (err) {
        console.error(`  ✗ Failed: ${err.message}`);
      }
    }
  }
  console.log('\n✅ Audio generation complete!');
  process.exit(0);
}
main();
