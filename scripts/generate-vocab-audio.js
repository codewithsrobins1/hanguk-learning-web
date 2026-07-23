// Generates TTS audio for every vocab flashcard's full (answer-filled)
// cloze sentence and uploads it to Storage, replacing the in-app reliance
// on the browser's native SpeechSynthesis voice (inconsistent quality,
// often no decent Korean voice installed at all) with a real generated
// clip — same approach as the Listening/TOPIK audio, just tts-1-hd for
// better quality since this is a fresh generation pass.
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

async function generateAudio(text, outputPath) {
  const mp3 = await openai.audio.speech.create({
    model: 'tts-1-hd',
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

  const onlyMissing = process.argv.includes('--missing-only');
  const snap = await db.collection('flashcards').get();
  console.log(`Found ${snap.size} flashcards${onlyMissing ? ' (regenerating missing audio only)' : ''}...\n`);

  let done = 0;
  let skipped = 0;
  for (const doc of snap.docs) {
    const card = doc.data();
    if (onlyMissing && card.audio_url) { skipped++; continue; }
    if (!card.cloze_sentence || !card.cloze_answer) {
      console.log(`  · ${doc.id}: no cloze_sentence/cloze_answer, skipped`);
      skipped++;
      continue;
    }

    const fullSentence = card.cloze_sentence.replace('___', card.cloze_answer);
    const fileName = `${doc.id}.mp3`;
    const localPath = path.join(tmpDir, fileName);
    const storagePath = `vocab/${fileName}`;

    console.log(`[${++done}/${snap.size}] ${doc.id}: ${fullSentence}`);
    try {
      await generateAudio(fullSentence, localPath);
      const url = await uploadToStorage(localPath, storagePath);
      await doc.ref.update({ audio_url: url });
      fs.unlinkSync(localPath);
      console.log(`  ✓ ${url}`);
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
    }
  }

  console.log(`\n✅ Done — ${done} generated, ${skipped} skipped.`);
  process.exit(0);
}
main();
