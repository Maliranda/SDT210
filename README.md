# Vocabulary Builder

Learn vocabulary with definitions, practice modes, and mastery levels.

## Theme

A vocabulary-learning app where you can add words with definitions and example sentences, organize them into themed lists, practice with multiple modes (multiple choice, fill-in-the-blank, matching), and track mastery (1–5 scale) with filters like new, learning, familiar, and mastered. Includes quiz mode, session statistics, search, review mode, and spaced practice.

## Entities

- **VocabularyWord** – A word with `term`, `definition`, optional `exampleSentence`, `masteryLevel` (1–5), and optional `listId`. Supports timestamps and last-practiced tracking.
- **WordList** – Themed list or category; has `name` and optional `description`.
- **PracticeSession** – Records a practice run: mode, word set, correct/total counts, and mastery level changes.

State is represented by **AppState**, which holds collections of words, lists, and sessions, plus filters (current list, mastery category).

## Project Structure

```
vocabulary-builder/
├── src/
│   ├── types.ts     
│   ├── main.tsx      
│   ├── App.tsx         
│   ├── index.css     
│   └── pages/
│       ├── HomePage.tsx
│       ├── VocabularyPage.tsx
│       └── PracticePage.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Open the URL shown in the terminal (e.g. `http://localhost:5173`) in your browser.

4. Type-check without building:
   ```bash
   npx tsc --noEmit
   ```
## AI Usage

AI was used to help generate initial TypeScript types, scaffold React Router setup, and structure page components.
All code was reviewed, adjusted manually, type-checked with tsc --noEmit, and tested to ensure correct routing and functionality.

