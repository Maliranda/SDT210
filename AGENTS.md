# Agent Instructions — Vocabulary Builder

Use this file when working on the codebase (Claude Code, Cursor, Gemini CLI, GitHub Copilot, etc.).

---

## 1. App Overview

- **Theme:** Vocabulary learning app.
- **Purpose:** Users add vocabulary words with definitions, organize them into lists, and practice with multiple-choice, fill-in-the-blank, and matching modes. Mastery levels (1–5) and practice sessions are tracked. Optional Firebase Auth login and per-user Firestore persistence.
- **Core entities:** `VocabularyWord`, `WordList`, `PracticeSession`. Types live in `src/types.ts`.

---

## 2. State Management Approach

- **Library:** Zustand (v5).
- **Why:** Simple hooks-based API, minimal boilerplate, fits one coherent "vocabulary state" without Redux-level structure. Easy to add `loading`/`error` for async work in Project 5.
- **Store file:** `src/store/vocabularyStore.ts`.
- **Context bridge:** `VocabularyBuilderContext` in `src/context/VocabularyBuilderContext.tsx` reads individual fields from the store via separate selectors (to avoid infinite re-render loops), then exposes the same API so pages keep using `useVocabularyBuilderContext()`.
- **Persistence:** The provider subscribes to the store; on every change it saves domain state to Firestore (per-user path `users/{uid}/vocabulary/appState`). On mount it loads from Firestore and calls `replaceState`.
- **Legacy hook:** `src/hooks/useVocabularyBuilder.ts` — the Project 3 custom hook. Still in the codebase with tests, but the app uses the store via context.

**State categorization (from Project 3 hook):**

| Category     | Examples                    | Tool / location                     |
|--------------|-----------------------------|-------------------------------------|
| UI state     | mastery filter, list filter | Store (shared across pages)         |
| Form state   | term, definition inputs     | Local `useState` in page components |
| Server cache | words, lists, sessions      | Zustand store                       |
| URL state    | routes                      | React Router                        |

---

## 3. State Shape

```ts
// Domain (src/types.ts)
export interface AppState {
  words: VocabularyWord[];
  lists: WordList[];
  sessions: PracticeSession[];
  currentListFilter: string | null;
  masteryFilter: MasteryCategory | null;
}

// Store state extends AppState with async support
export interface VocabularyStoreState extends AppState {
  loading: boolean;
  error: string | null;
}
```

---

## 4. API Conventions

- **Where:** `src/services/api.ts`.
- **Approach:** Plain `fetch` (no axios; TanStack Query can be added later).
- **Interface:** `IVocabularyApi` — `loadState`, `saveState`, `getWords`, `addWord`, `updateWord`, `deleteWord`, `getLists`, `addList`, `getSessions`, `recordSession`.
- **Status:** Placeholder implementations (empty/mock data) so the app compiles. Project 5 will wire real persistence and use `loading`/`error` from the store.

---

## 5. File Structure

```
src/
├── components/
│   └── ui/              # Reusable UI abstractions (MUI wrappers)
├── context/             # React contexts (VocabularyBuilderContext, AuthContext)
├── hooks/               # Custom hooks (useVocabularyBuilder) + tests
├── lib/                 # Firebase, persistence repository
├── pages/               # Pages — composition of UI components and hooks
├── services/            # API service layer (api.ts)
├── store/               # Zustand store (vocabularyStore.ts)
├── test/                # Test setup (Vitest)
├── types.ts
├── App.tsx
├── ErrorBoundary.tsx
├── main.tsx
└── index.css
```

| Path / pattern                              | Purpose |
|---------------------------------------------|---------|
| `src/types.ts`                              | Domain types |
| `src/store/vocabularyStore.ts`              | Zustand store: state + actions |
| `src/context/VocabularyBuilderContext.tsx`   | Provider that bridges store ↔ pages, wires persistence |
| `src/context/AuthContext.tsx`               | Firebase Auth provider (user, loading, signOut) |
| `src/services/api.ts`                       | `IVocabularyApi` + placeholder implementations |
| `src/hooks/useVocabularyBuilder.ts`         | Project 3 custom hook (kept for grading) |
| `src/hooks/useVocabularyBuilder.test.ts`    | Tests for the hook |
| `src/pages/HomePage.tsx`                    | Landing page with stats and links |
| `src/pages/VocabularyPage.tsx`              | Add/edit/delete words and lists |
| `src/pages/PracticePage.tsx`                | Multiple choice, fill-in-the-blank, matching |
| `src/pages/LoginPage.tsx`                   | Sign in / sign up (Firebase Auth) |
| `src/components/ui/*`                       | Reusable UI components (MUI wrappers) |
| `src/lib/firebase.ts`                       | Firebase app, Firestore, Auth init |
| `src/lib/vocabularyRepository.ts`           | Firestore persistence adapter (per-user) |
| `src/ErrorBoundary.tsx`                     | Catches render errors |

Naming: Components PascalCase; hooks `use*`; store `*Store.ts`; services `api.ts`.

---

## 6. Adding New Features

1. **Types** — `src/types.ts`: add or extend types.
2. **Store** — `src/store/vocabularyStore.ts`: add action to the store.
3. **API** — `src/services/api.ts`: add method to `IVocabularyApi` + placeholder.
4. **Context** — `src/context/VocabularyBuilderContext.tsx`: expose new action via selector + value object.
5. **UI** — In the relevant page, destructure from `useVocabularyBuilderContext()` and wire buttons/handlers.

Example (add "archive word"): add `archived: boolean` to `VocabularyWord`; add `archiveWord(wordId)` in the store; add to `IVocabularyApi`; expose from context; add button in VocabularyPage.

---

## 7. Coding Rules

- **TypeScript** — Strict mode. All files `.ts` / `.tsx`. No `any` without good reason.
- **Step-down rule** — Pages (`src/pages/`) compose only UI abstractions from `src/components/ui/`. No raw HTML tags (`<div>`, `<button>`, `<input>`, `<form>`, `<ul>`, `<li>`, `<h1>`, `<p>`, `<a>`, `<section>`, `<label>`, `<select>`, `<option>`) and no CSS class names in page JSX. When adding new behaviour or look: first add or extend the UI component, then use it on the page.
- **Reusability** — UI components must not depend on the business domain (words, lists). Pages and contexts bind the domain to the UI.
- **Immutability** — All state updates via new object/array copies; no mutations.
- **Persistence** — CRUD operations are persisted via Firestore. Persistence logic lives in `src/lib/`, never inside page components.
- **Tests** — Custom hooks must have tests (Vitest + `@testing-library/react`). Cover main operations and at least one edge case.

| Allowed | Disallowed |
|---------|------------|
| Use only components from `components/ui/` in pages | Raw HTML and class names in page components |
| Keep styles in CSS files or the UI library theme | Inline styles and duplicated markup in pages |
| Add new logic via hooks and repositories in `lib/` | Persistence logic inside page components |
| Extend the UI set with new abstractions | New pages with "temporary" markup and no UI components |

---

## 8. Pre-commit Checks

- `npm run test` — All tests pass.
- `npx tsc --noEmit` — No TypeScript errors.
- Pages must not contain raw HTML tags — only components from `src/components/ui/`.
