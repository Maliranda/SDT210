/** Mastery level 1–5; used for practice performance tracking */
export type MasteryLevel = 1 | 2 | 3 | 4 | 5;

/** Filter categories for words */
export type MasteryCategory = 'new' | 'learning' | 'familiar' | 'mastered';

/** Practice mode for drills */
export type PracticeMode = 'multiple-choice' | 'fill-in-the-blank' | 'matching';

/** Core entity: a single vocabulary word with metadata */
export interface VocabularyWord {
  id: string;
  term: string;
  definition: string;
  exampleSentence?: string;
  masteryLevel: MasteryLevel;
  listId: string | null;
  lastPracticedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Core entity: themed list or category of words */
export interface WordList {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/** Core entity: a practice session for statistics */
export interface PracticeSession {
  id: string;
  startedAt: string;
  endedAt: string;
  mode: PracticeMode;
  wordIds: string[];
  correctCount: number;
  totalCount: number;
  masteryChanges: { wordId: string; previousLevel: MasteryLevel; newLevel: MasteryLevel }[];
}

/** App state: collections and values used across the app */
export interface AppState {
  words: VocabularyWord[];
  lists: WordList[];
  sessions: PracticeSession[];
  currentListFilter: string | null;
  masteryFilter: MasteryCategory | null;
}
