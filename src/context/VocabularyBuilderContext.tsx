import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useVocabularyStore, getStoreDomainState } from '../store/vocabularyStore';
import { getFirestoreInstance, isFirebaseConfigured } from '../lib/firebase';
import { createFirebaseVocabularyRepository } from '../lib/vocabularyRepository';
import { useAuth } from './AuthContext';
import type { VocabularyStoreState } from '../store/vocabularyStore';

type Actions = Pick<
  ReturnType<typeof useVocabularyStore.getState>,
  'addWord' | 'updateWord' | 'deleteWord' | 'addList' | 'updateList' | 'deleteList' |
  'setCurrentListFilter' | 'setMasteryFilter' | 'updateWordMastery' | 'recordPracticeSession'
>;

type VocabularyBuilderValue = {
  state: Pick<VocabularyStoreState, 'words' | 'lists' | 'sessions' | 'currentListFilter' | 'masteryFilter' | 'loading' | 'error'>;
} & Actions;

const stateSelector = (s: VocabularyStoreState & Actions) => ({
  words: s.words, lists: s.lists, sessions: s.sessions,
  currentListFilter: s.currentListFilter, masteryFilter: s.masteryFilter,
  loading: s.loading, error: s.error,
});

const actionsSelector = (s: ReturnType<typeof useVocabularyStore.getState>) => ({
  addWord: s.addWord, updateWord: s.updateWord, deleteWord: s.deleteWord,
  addList: s.addList, updateList: s.updateList, deleteList: s.deleteList,
  setCurrentListFilter: s.setCurrentListFilter, setMasteryFilter: s.setMasteryFilter,
  updateWordMastery: s.updateWordMastery, recordPracticeSession: s.recordPracticeSession,
  replaceState: s.replaceState,
});

const VocabularyBuilderContext = createContext<VocabularyBuilderValue | null>(null);

export function VocabularyBuilderProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const userId = auth?.user?.uid ?? null;

  const state = useVocabularyStore(useShallow(stateSelector));
  const actions = useVocabularyStore(useShallow(actionsSelector));

  const hasLocalMutationRef = useRef(false);
  const skipNextPersistRef = useRef(false);

  const persistence = (() => {
    if (!isFirebaseConfigured()) return undefined;
    const db = getFirestoreInstance();
    return db ? createFirebaseVocabularyRepository(db, 'vocabulary', userId) : undefined;
  })();

  useEffect(() => {
    if (!persistence?.load) return;
    hasLocalMutationRef.current = false;
    persistence.load()
      .then((loaded) => {
        if (!hasLocalMutationRef.current) {
          skipNextPersistRef.current = true;
          actions.replaceState(loaded);
        }
      })
      .catch((err) => console.error('Failed to load state:', err));
  }, [userId]);

  useEffect(() => {
    if (!persistence?.save) return;
    return useVocabularyStore.subscribe(() => {
      if (skipNextPersistRef.current) { skipNextPersistRef.current = false; return; }
      hasLocalMutationRef.current = true;
      persistence.save(getStoreDomainState()).catch((err) => console.error('Failed to save state:', err));
    });
  }, [userId]);

  return (
    <VocabularyBuilderContext.Provider value={{ state, ...actions }}>
      {children}
    </VocabularyBuilderContext.Provider>
  );
}

export function useVocabularyBuilderContext(): VocabularyBuilderValue {
  const ctx = useContext(VocabularyBuilderContext);
  if (!ctx) throw new Error('useVocabularyBuilderContext must be used within VocabularyBuilderProvider');
  return ctx;
}
