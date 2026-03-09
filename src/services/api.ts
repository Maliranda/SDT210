import type { AppState, VocabularyWord, WordList, PracticeSession } from '../types';

export interface IVocabularyApi {
  loadState(): Promise<AppState>;
  saveState(state: AppState): Promise<void>;
  getWords(): Promise<VocabularyWord[]>;
  addWord(word: Omit<VocabularyWord, 'id' | 'createdAt' | 'updatedAt' | 'lastPracticedAt'>): Promise<VocabularyWord>;
  updateWord(id: string, updates: Partial<Pick<VocabularyWord, 'term' | 'definition' | 'exampleSentence' | 'listId' | 'masteryLevel'>>): Promise<VocabularyWord | null>;
  deleteWord(id: string): Promise<boolean>;
  getLists(): Promise<WordList[]>;
  addList(list: Omit<WordList, 'id' | 'createdAt' | 'updatedAt'>): Promise<WordList>;
  getSessions(): Promise<PracticeSession[]>;
  recordSession(session: PracticeSession): Promise<PracticeSession>;
}

const now = () => new Date().toISOString();
const uuid = () => crypto.randomUUID();

export const vocabularyApi: IVocabularyApi = {
  async loadState() {
    return { words: [], lists: [], sessions: [], currentListFilter: null, masteryFilter: null };
  },
  async saveState() {},
  async getWords() { return []; },
  async addWord(word) {
    return { ...word, id: uuid(), lastPracticedAt: null, createdAt: now(), updatedAt: now() };
  },
  async updateWord() { return null; },
  async deleteWord() { return true; },
  async getLists() { return []; },
  async addList(list) {
    return { ...list, id: uuid(), createdAt: now(), updatedAt: now() };
  },
  async getSessions() { return []; },
  async recordSession(session) { return session; },
};
