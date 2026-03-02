# Vocabulary Builder

Learn vocabulary with definitions, practice modes, and mastery levels.

## Theme

A vocabulary-learning app where you can add words with definitions and example sentences, organize them into themed lists, practice with multiple modes (multiple choice, fill-in-the-blank, matching), and track mastery (1–5 scale) with filters like new, learning, familiar, and mastered. Includes quiz mode, session statistics, search, review mode, and spaced practice.

## Entities

- **VocabularyWord** – A word with `term`, `definition`, optional `exampleSentence`, `masteryLevel` (1–5), and optional `listId`. Supports timestamps and last-practiced tracking.
- **WordList** – Themed list or category; has `name` and optional `description`.
- **PracticeSession** – Records a practice run: mode, word set, correct/total counts, and mastery level changes.

State is represented by **AppState**, which holds collections of words, lists, and sessions, plus filters (current list, mastery category).

## UI library

The UI is built with **Material UI (MUI)**. Components in `src/components/ui/` wrap MUI primitives (Typography, Button, TextField, Select, Box, List, etc.) so that pages use a stable, domain-agnostic API. The app is wrapped in `ThemeProvider` and `CssBaseline` in `main.tsx`; the theme is defined in `src/theme.ts`.

## Project Structure

```
vocabulary-builder/
├── CURSOR.md                 # AI agent instructions (rules, structure, step-down rule)
├── src/
│   ├── theme.ts              # MUI theme
│   ├── types.ts
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── components/
│   │   └── ui/               # Reusable UI (MUI-based: Button, Input, PageLayout, etc.)
│   ├── context/
│   │   └── VocabularyBuilderContext.tsx
│   ├── hooks/
│   │   ├── useVocabularyBuilder.ts
│   │   └── useVocabularyBuilder.test.ts
│   ├── lib/
│   │   ├── firebase.ts
│   │   └── vocabularyRepository.ts  
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── VocabularyPage.tsx
│   │   └── PracticePage.tsx
│   └── test/
│       └── setup.ts
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

## Project 3: Custom Hook

### Hook Operations

1. **addWord** – Adds a new vocabulary word with term, definition, and optional listId and exampleSentence. New words start at mastery level 1.
2. **updateWord** – Updates a word’s term, definition, exampleSentence, or listId by id.
3. **deleteWord** – Removes a word by id from the words array.
4. **addList** – Creates a new word list with name and optional description.
5. **setCurrentListFilter** – Sets or clears the current list filter (list id or null).
6. **setMasteryFilter** – Sets or clears the mastery category filter (new, learning, familiar, mastered, or null).
7. **updateWordMastery** – Updates a word’s mastery level (1–5) by word id.
8. **recordPracticeSession** – Appends a practice session to the sessions array.

### Running Tests

```bash
npm install
npm run test
```

### Test Coverage

1. **Initial state** – Hook starts with empty words, lists, sessions, and null filters.
2. **addWord** – Adding a word creates one word with term, definition, mastery 1, and generated id/timestamps.
3. **deleteWord** – Deleting a word by id removes it from the list.
4. **addList and setCurrentListFilter** – Adding a list and then setting the list filter updates state correctly.
5. **updateWord** – Updating a word’s term and definition changes only that word.
6. **updateWordMastery** – Updating a word’s mastery level changes only that word.
7. **recordPracticeSession** – Recording a session appends it to sessions with correct mode and counts.
8. **Edge case** – deleteWord with a non-existent id leaves state unchanged.

### AI Usage Statement

AI was used to generate the custom hook scaffolding from the existing type definitions, test boilerplate and edge-case suggestions, and to wire the hook into pages via a context provider. All code was reviewed, type-checked with `tsc --noEmit`, and verified with `npm run test`.

