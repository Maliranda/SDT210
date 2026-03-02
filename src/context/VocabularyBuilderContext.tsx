import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useVocabularyBuilder } from '../hooks/useVocabularyBuilder';
import { getFirestoreInstance, isFirebaseConfigured } from '../lib/firebase';
import { createFirebaseVocabularyRepository } from '../lib/vocabularyRepository';

type VocabularyBuilderValue = ReturnType<typeof useVocabularyBuilder>;

const VocabularyBuilderContext = createContext<VocabularyBuilderValue | null>(
  null
);

export function VocabularyBuilderProvider({ children }: { children: ReactNode }) {
  const persistence = useMemo(() => {
    if (!isFirebaseConfigured()) return undefined;
    const db = getFirestoreInstance();
    return db ? createFirebaseVocabularyRepository(db) : undefined;
  }, []);

  const value = useVocabularyBuilder(
    persistence ? { persistence } : undefined
  );

  return (
    <VocabularyBuilderContext.Provider value={value}>
      {children}
    </VocabularyBuilderContext.Provider>
  );
}

export function useVocabularyBuilderContext(): VocabularyBuilderValue {
  const ctx = useContext(VocabularyBuilderContext);
  if (ctx == null) {
    throw new Error(
      'useVocabularyBuilderContext must be used within VocabularyBuilderProvider'
    );
  }
  return ctx;
}
