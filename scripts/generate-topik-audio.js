require('dotenv').config({ path: '.env.local' });
const OpenAI = require('openai');
const admin = require('firebase-admin');
const sa = require('../serviceAccountKey.json');
const fs = require('fs');
const path = require('path');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
admin.initializeApp({
  credential: admin.credential.cert(sa),
  storageBucket: 'hanguk-learning-app.firebasestorage.app',
});
const db = admin.firestore();
const bucket = admin.storage().bucket();

// Scripts embed speaker labels like "A: ... B: ..." or "여자: ... 남자: ..."
// for display, but TTS should only speak the dialogue content.
function stripSpeakerLabels(script) {
  return script
    .replace(/(?:^|\s)([A-Za-z가-힣]{1,4}):\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

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
  const tmpDir = './tmp-topik-audio';
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

  const snap = await db.collection('topik_tests').get();
  const tests = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  let total = 0;
  let skipped = 0;
  for (const test of tests) {
    const questions = test.listening_questions || [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (q.audio_url) {
        skipped++;
        continue;
      }

      const fileName = `${test.id}_listening_${i}.mp3`;
      const localPath = path.join(tmpDir, fileName);
      const storagePath = `topik/${test.id}/${fileName}`;

      console.log(`[${++total}] ${test.id} listening ${i}`);

      try {
        const spokenText = stripSpeakerLabels(q.script);
        await generateAudio(spokenText, localPath);
        const url = await uploadToStorage(localPath, storagePath);

        const ref = db.collection('topik_tests').doc(test.id);
        const freshSnap = await ref.get();
        const freshQuestions = freshSnap.data().listening_questions;
        freshQuestions[i].audio_url = url;
        await ref.update({ listening_questions: freshQuestions });

        fs.unlinkSync(localPath);
        console.log(`  ✓ ${url}`);
        await new Promise((r) => setTimeout(r, 200));
      } catch (err) {
        console.error(`  ✗ Failed: ${err.message}`);
      }
    }
  }

  console.log(`\n✅ Audio generation complete! (${skipped} already had audio)`);
  process.exit(0);
}

main();
