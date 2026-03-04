# 한국 Hanguk — Korean Learning App

A web-based Korean language learning app. Practice Hangul characters, study vocabulary with flashcards, and build reading comprehension — all backed by Firebase.

## 🚀 Quick Start

### 1. Install
```bash
npm install
```

### 2. Environment Variables
Rename `.env.local.example` to `.env.local` and fill in your Firebase project values:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### 3. Seed the Database
```bash
npm install firebase-admin
# Place serviceAccountKey.json in the project root
node firebase-seed/index.js
```

### 4. Run
```bash
npm run dev
```

---

## 📱 Features

| Feature | Description |
|---------|-------------|
| 🔤 Hangul Chart | Interactive vowel and consonant reference with focus character panel |
| 🃏 Flashcard Sessions | Flip cards, mark known/still learning, track mastery per set |
| 📖 Reading Practice | Korean passages with tap-to-highlight lines and translation toggle |
| ❓ Comprehension Quizzes | 4-option quizzes after each passage with Korean/English toggle |
| 🔥 Streak Tracking | Daily streak auto-updates on login |
| 📊 Progress Dashboard | Overview of Hangul, vocab, and reading progress on home screen |
| 🌐 Word of the Day | Random flashcard on the home screen, flippable |

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type-safe throughout |
| **Tailwind CSS** | Utility-first styling |
| **Firebase Auth** | Email/password authentication, no email verification |
| **Firestore** | NoSQL document database for all content and user data |
| **Firebase Admin SDK** | Server-side seed scripts |

---

## 📁 Project Structure

```
app/
  (app)/              ← authenticated route group (sidebar layout)
    home/             ← dashboard
    cards/            ← flashcard sets + study session
    read/             ← passages + quiz
    hangul/           ← character chart + study session
    profile/          ← user stats + sign out
  login/
  signup/

components/           ← FlipCard, ProgressBar, Pill
hooks/                ← useFlashcards, usePassages, useUserStats
lib/                  ← firebase.ts, auth.tsx
data/                 ← hangul.ts (static character data)
types/                ← shared TypeScript types
firebase-seed/        ← modular content files + seed runner
```

---

## 🗄️ Database Structure

```
Firestore Collections:

Public (readable by all authenticated users):
  /flashcard_sets/{setId}
  /flashcards/{cardId}
  /passages/{passageId}
  /comprehension_questions/{questionId}

Private (owner only):
  /profiles/{uid}
  /user_card_progress/{uid}_{cardId}
  /user_passage_progress/{uid}_{passageId}
```

---

## ✏️ Adding New Content

Content is managed through the `firebase-seed/` directory. Edit the relevant file and re-run the seed — no app deployment needed.

```
firebase-seed/
  index.js            ← seed runner
  flashcard-sets.js   ← add new sets
  flashcards.js       ← add new cards
  passages.js         ← add new passages
  questions.js        ← add new quiz questions
```

```bash
node firebase-seed/index.js
```

Re-running is safe — existing user progress is never overwritten.
See `FIREBASE_UPDATES.ts` for full instructions including user management.

---

## 🔐 Authentication

- Email/password via Firebase Auth
- No email verification required
- Password requirements: 8+ characters, 1 number, 1 special character
- HTML/script injection validated on both client and server
- Session persisted via Firebase's built-in browser persistence
