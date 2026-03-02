# Cursor Instructions — Vocabulary Builder

This file defines coding rules and project structure. All changes in the repository must follow these rules.

---

## 1. Step-down rule

- **Pages** (`src/pages/`) — Compose only abstractions: layouts, sections, hook/context usage. No raw HTML (`<div>`, `<button>`, `<input>`, `<form>`, `<ul>`, `<li>`, `<h1>`, `<p>`, `<a>`, `<section>`, `<label>`, `<select>`, `<option>`) and no direct use of CSS class names in page JSX.
- **UI components** (`src/components/ui/`) — Reusable abstractions that encapsulate markup and semantics. Pages import only from here (e.g. `PageLayout`, `Heading`, `Text`, `AppLink`, `Button`, `Input`, `Select`, `Form`, `List`, `Card`, `Section`, `EmptyState`). Prefer building on a shared UI library (e.g. MUI, Radix, Chakra) rather than raw HTML/CSS.
- **Styles** — Live in CSS files (e.g. `index.css`) or the UI library’s theme. Do not duplicate styles in inline attributes in page components; in UI components only combined classes or theme overrides for their root elements are allowed.
- When adding new behaviour or look: first add or extend the right UI component, then use it on the page. Do not add “temporary” raw HTML to pages.

---

## 2. Project structure

```
src/
├── components/
│   └── ui/              # Reusable UI abstractions (Button, Input, PageLayout, etc.); use a library (MUI, Radix, etc.)
├── context/             # React contexts (VocabularyBuilderContext)
├── hooks/               # Custom hooks (useVocabularyBuilder, etc.) + tests
├── lib/                 # External services, repositories (Firebase, API)
├── pages/               # Pages — only composition of UI components and hooks
├── test/                # Test setup (Vitest)
├── types.ts
├── App.tsx
├── main.tsx
└── index.css
```

- **pages/** — No HTML elements and no direct CSS module imports for layout; use only components from `components/ui/`.
- **components/ui/** — Each component covers one element or block type (button, input, page layout, list, card, etc.). Props are explicit and typed; avoid spreading arbitrary DOM attributes unless needed for reusability.
- **hooks/** — State and operations. At least one custom hook with proper tests (e.g. `useVocabularyBuilder` + `useVocabularyBuilder.test.ts`).
- **lib/** — Server persistence (Firebase, BaaS), API clients. Repositories/services must not depend on React.

---

## 3. Coding rules

- **TypeScript** — Strict mode. All files `.ts` / `.tsx`. No `any` without good reason.
- **Reusability** — UI components must not depend on the business domain (words, lists). Pages and contexts bind the domain to the UI.
- **CRUD and persistence** — Create/read/update/delete operations are persisted on the server (e.g. Firebase Firestore). Local state in the hook is synced with the backend (load on mount, save after mutations).
- **Immutability** — All state updates via new object/array copies; no mutations.
- **Tests** — Custom hooks must have tests (e.g. Vitest + `@testing-library/react`). Cover main operations and at least one edge case.

---

## 4. Allowed / disallowed

| Allowed | Disallowed |
|--------|------------|
| Use only components from `components/ui/` in pages | Raw HTML and class names in page components |
| Keep styles in CSS files or the UI library theme | Inline styles and duplicated markup in pages |
| Add new logic via hooks and repositories in `lib/` | Persistence logic inside page components |
| Extend the UI set with new abstractions | New pages with “temporary” markup and no UI components |

---

## 5. Pre-commit checks

- `npm run test` — All tests pass.
- `npx tsc --noEmit` — No TypeScript errors.
- Pages must not contain tags `div`, `button`, `input`, `form`, `ul`, `li`, `h1`, `h2`, `p`, `a`, `section`, `label`, `select`, `option` — only components from `src/components/ui/`.
