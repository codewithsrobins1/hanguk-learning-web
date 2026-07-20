# 한국 Hanguk — Korean Learning App

A full-stack Korean language learning platform covering all six core skills — vocabulary, grammar patterns, reading, listening, speaking, and TOPIK exam prep — with AI-generated content, spaced-practice mechanics, and a gamified progress system.

**[Live demo →](https://hanguk-learning-web.vercel.app)** — no sign-up required, try the interactive Vocab and Patterns exercises straight from the landing page.

---

## 📱 Features

### Learning modules

| Module                      | Description                                                                                                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🃏 **Vocab**                | Cloze-style flashcards that force active recall — fill in the blank inside a real sentence, not just flip a card. Includes a dedicated "review mastered cards" mode.   |
| 文 **Patterns**             | Grammar patterns practiced inside full sentences rather than isolated rules, with a stem-conjugation breakdown table for patterns that attach to verb/adjective stems. |
| 📖 **Reading**              | Short passages at multiple levels with comprehension quizzes and inline translation toggles.                                                                           |
| 🎧 **Listening**            | Native-paced audio (AI-generated) with adjustable playback speed and replay.                                                                                           |
| 💬 **Speaking**             | Shadow real dialogue and get instant pronunciation feedback — audio is transcribed and graded automatically.                                                           |
| 🏅 **TOPIK Practice Tests** | Full-length, level-gated practice exams scored like the real exam, plus a placement test for new learners.                                                             |
| 가 **Hangul**               | Interactive vowel/consonant reference and a dedicated character-writing practice session.                                                                              |

### Progress & motivation

- **XP and leveling** with animated level-up celebrations
- **Weekly Progress** dashboard scoped to real activity (not lifetime totals) — resets every Monday or on demand, respects each user's enabled/disabled sections
- **AI-generated weekly recap** — a short Claude-written summary of the past week's activity plus two concrete recommendations, cached and regenerated once per week
- **TOPIK readiness card** that adapts its copy based on whether you've attempted, passed, or never tried a test
- Daily streak tracking with a lazy client-side reset (no backend cron)
- Per-user nav customization — hide/show any learning module from Settings

### Platform

- Public marketing/demo landing page with two live, self-contained exercise widgets — visitors can try real interaction patterns from the app with zero signup
- Fully responsive, mobile + desktop layouts throughout
- Separate isolated Firebase environments for Production and QA, deployed automatically from dedicated Git branches

---

## 🛠 Tech Stack

| Technology                    | Purpose                                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------------------- |
| **Next.js 16** (App Router)   | React framework, server + client components, API routes                                            |
| **React 19** + **TypeScript** | Type-safe UI throughout                                                                            |
| **Tailwind CSS**              | Utility-first styling on a custom design token system                                              |
| **Framer Motion**             | Micro-interactions — page transitions, staggered reveals, level-up animations, drag interactions   |
| **@dnd-kit**                  | Drag-and-drop for pattern-matching exercises                                                       |
| **Firebase Auth**             | Email/password authentication                                                                      |
| **Firestore**                 | NoSQL document database for all content and user data                                              |
| **Firebase Admin SDK**        | Server-side content generation and migration scripts                                               |
| **Anthropic Claude API**      | Generates grammar/vocab/reading/test content offline; writes the personalized weekly AI recap live |
| **OpenAI API**                | Whisper transcription for speaking practice, TTS for listening audio generation                    |
| **Vercel**                    | Hosting, with separate Production/Preview deployments per branch                                   |

---

## 🏗 Architecture notes

A few things worth calling out for anyone reading the code:

- **AI content pipeline**: most learning content (patterns, vocab cloze sentences, TOPIK tests, listening/dialogue audio) is generated offline via one-off scripts in `scripts/` that call Claude/OpenAI and write directly to Firestore — the app itself never calls an LLM to render static content, keeping runtime cost and latency at zero for anything except the live AI weekly recap.
- **No backend cron**: streak resets and weekly-progress resets are both handled with a lazy client-side pattern — checked and rolled forward on each app load rather than a scheduled function, since there's no server runtime to host one.
- **Environment isolation**: Production and QA run on fully separate Firebase projects (separate Auth pools, separate Firestore data) selected via Vercel's per-branch environment variables, so QA testing never touches real user data.
- **Nav-aware everywhere**: which learning modules a user has enabled isn't just a sidebar toggle — Weekly Progress, the AI recap, and the home dashboard all filter against the same preference so a hidden module disappears consistently across the app.

---

## 📁 Project Structure

```
app/
  (app)/                 ← authenticated route group (sidebar layout)
    home/                ← dashboard: XP, weekly progress, AI recap
    cards/                ← vocab sets, detail view, study/review sessions
    patterns/             ← grammar pattern hub + practice
    read/                 ← passages + comprehension quizzes
    listen/                ← listening exercises
    shadow/                ← speaking/shadowing sessions
    grammar/               ← grammar lessons + milestone quizzes
    tests/                  ← TOPIK practice tests + placement test
    hangul/                 ← character reference + writing practice
    profile/                ← stats, settings, account management
  api/
    grammar/generate/        ← Claude-generated personalized lesson content
    shadow/evaluate/          ← Whisper transcription + Claude pronunciation grading
    home/insights/             ← Claude-generated weekly progress recap
  login/, signup/               ← auth pages
  page.tsx                       ← public landing page (logged out) / redirect (logged in)

components/
  landing/                        ← marketing page + interactive demo widgets
  ...                              ← shared UI (ProgressBar, TopikSeal, LevelUpOverlay, etc.)

hooks/                              ← per-feature Firestore data hooks
lib/                                 ← firebase.ts, auth.tsx, xp.ts, category-colors.ts, nav-config.ts
scripts/                              ← AI content generation + one-off data migrations
firebase-seed/                         ← foundational seed data (flashcards, passages, questions)
types/                                  ← shared TypeScript types
```
