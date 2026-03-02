import { doc, getDoc, setDoc } from 'firebase/firestore'
import type { Firestore } from 'firebase/firestore'
import type { AppState } from '../types'

const APP_STATE_DOC_ID = 'appState'

export interface IVocabularyRepository {
  load(): Promise<AppState>
  save(state: AppState): Promise<void>
}

function parseState(data: unknown): AppState {
  if (data == null || typeof data !== 'object') {
    return {
      words: [],
      lists: [],
      sessions: [],
      currentListFilter: null,
      masteryFilter: null,
    }
  }
  const o = data as Record<string, unknown>
  return {
    words: Array.isArray(o.words) ? o.words as AppState['words'] : [],
    lists: Array.isArray(o.lists) ? o.lists as AppState['lists'] : [],
    sessions: Array.isArray(o.sessions) ? o.sessions as AppState['sessions'] : [],
    currentListFilter: typeof o.currentListFilter === 'string' ? o.currentListFilter : null,
    masteryFilter: typeof o.masteryFilter === 'string' && ['new', 'learning', 'familiar', 'mastered'].includes(o.masteryFilter)
      ? o.masteryFilter as AppState['masteryFilter']
      : null,
  }
}

function stripUndefined<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(stripUndefined) as T
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (v !== undefined) out[k] = typeof v === 'object' && v !== null ? stripUndefined(v) : v
  }
  return out as T
}

export function createFirebaseVocabularyRepository(db: Firestore, collectionName = 'vocabulary'): IVocabularyRepository {
  const ref = doc(db, collectionName, APP_STATE_DOC_ID)
  return {
    async load() {
      const snap = await getDoc(ref)
      const data = snap.exists() ? snap.data() : null
      return parseState(data)
    },
    async save(state: AppState) {
      await setDoc(ref, stripUndefined(state))
    },
  }
}
