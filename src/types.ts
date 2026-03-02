export type MasteryLevel = 1 | 2 | 3 | 4 | 5;

export type MasteryCategory = 'new' | 'learning' | 'familiar' | 'mastered';

export type PracticeMode = 'multiple-choice' | 'fill-in-the-blank' | 'matching';

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

export interface WordList {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

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

export interface AppState {
  words: VocabularyWord[];
  lists: WordList[];
  sessions: PracticeSession[];
  currentListFilter: string | null;
  masteryFilter: MasteryCategory | null;
}
