import { useState } from 'react'
import { useVocabularyBuilderContext } from '../context/VocabularyBuilderContext'
import {
  PageLayout,
  Heading,
  Text,
  AppLink,
  Section,
  Form,
  Input,
  Button,
  FormField,
  Select,
  type SelectOption,
  List,
  ListItem,
  EmptyState,
  Strong,
  Span,
  Card,
} from '../components/ui'
import type { MasteryCategory, MasteryLevel } from '../types'
import type { VocabularyWord } from '../types'

function wordMatchesMasteryFilter(word: VocabularyWord, filter: MasteryCategory | null): boolean {
  if (filter == null) return true
  switch (filter) {
    case 'new':
      return word.masteryLevel === 1
    case 'learning':
      return word.masteryLevel === 2
    case 'familiar':
      return word.masteryLevel === 3
    case 'mastered':
      return word.masteryLevel === 4 || word.masteryLevel === 5
    default:
      return true
  }
}

const FILTER_MASTERY_OPTIONS: SelectOption[] = [
  { value: '', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'learning', label: 'Learning' },
  { value: 'familiar', label: 'Familiar' },
  { value: 'mastered', label: 'Mastered' },
]

const ADD_WORD_MASTERY_OPTIONS: SelectOption[] = [
  { value: '1', label: '1 (new)' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5 (mastered)' },
]

function VocabularyPage() {
  const { state, addWord, updateWord, updateWordMastery, deleteWord, addList, setMasteryFilter } =
    useVocabularyBuilderContext()
  const [term, setTerm] = useState('')
  const [definition, setDefinition] = useState('')
  const [listName, setListName] = useState('')
  const [addWordMastery, setAddWordMastery] = useState<string>('1')
  const [editingWordId, setEditingWordId] = useState<string | null>(null)
  const [editTerm, setEditTerm] = useState('')
  const [editDefinition, setEditDefinition] = useState('')
  const [editMastery, setEditMastery] = useState<string>('1')

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault()
    if (term.trim() && definition.trim()) {
      const level = Number(addWordMastery) as MasteryLevel
      addWord(term.trim(), definition.trim(), {
        masteryLevel: level >= 1 && level <= 5 ? level : 1,
      })
      setTerm('')
      setDefinition('')
    }
  }

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault()
    if (listName.trim()) {
      addList(listName.trim())
      setListName('')
    }
  }

  const handleMasteryChange = (value: string) =>
    setMasteryFilter((value || null) as MasteryCategory | null)

  const startEditing = (word: VocabularyWord) => {
    setEditingWordId(word.id)
    setEditTerm(word.term)
    setEditDefinition(word.definition)
    setEditMastery(String(word.masteryLevel))
  }

  const cancelEditing = () => {
    setEditingWordId(null)
  }

  const saveEditing = () => {
    if (editingWordId == null) return
    const level = Number(editMastery) as MasteryLevel
    const safeLevel = level >= 1 && level <= 5 ? level : 1
    updateWord(editingWordId, {
      term: editTerm.trim(),
      definition: editDefinition.trim(),
    })
    updateWordMastery(editingWordId, safeLevel)
    setEditingWordId(null)
  }

  const filteredWords = state.words.filter((w) => wordMatchesMasteryFilter(w, state.masteryFilter))

  return (
    <PageLayout>
      <Heading level={1}>Vocabulary</Heading>
      <Text>
        Manage your vocabulary words: add new terms with definitions and example
        sentences, edit or delete existing ones, and organize words into themed
        lists. Filter by mastery level (new, learning, familiar, mastered).
      </Text>
      <Text as="span">
        <AppLink to="/">← Back to Home</AppLink>
      </Text>

      <Section
        title={
          state.masteryFilter
            ? `Your words (${filteredWords.length} of ${state.words.length})`
            : `Your words (${state.words.length})`
        }
      >
        <Form onSubmit={handleAddWord}>
          <Input
            type="text"
            placeholder="Term"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Definition"
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
          />
          <FormField label="Mastery:">
            <Select
              options={ADD_WORD_MASTERY_OPTIONS}
              value={addWordMastery}
              onChange={(e) => setAddWordMastery(e.target.value)}
            />
          </FormField>
          <Button type="submit">Add word</Button>
        </Form>

        <FormField label="Filter by mastery:">
          <Select
            options={FILTER_MASTERY_OPTIONS}
            value={state.masteryFilter ?? ''}
            onChange={(e) => handleMasteryChange(e.target.value)}
          />
        </FormField>

        {state.words.length === 0 ? (
          <EmptyState message="No words yet. Add one above!" />
        ) : filteredWords.length === 0 ? (
          <EmptyState message={`No words match "${state.masteryFilter}". Change the filter or add words.`} />
        ) : (
          <List>
            {filteredWords.map((word) => (
              <ListItem key={word.id}>
                {editingWordId === word.id ? (
                  <Card>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault()
                        saveEditing()
                      }}
                    >
                      <Input
                        type="text"
                        placeholder="Term"
                        value={editTerm}
                        onChange={(e) => setEditTerm(e.target.value)}
                      />
                      <Input
                        type="text"
                        placeholder="Definition"
                        value={editDefinition}
                        onChange={(e) => setEditDefinition(e.target.value)}
                      />
                      <FormField label="Mastery:">
                        <Select
                          options={ADD_WORD_MASTERY_OPTIONS}
                          value={editMastery}
                          onChange={(e) => setEditMastery(e.target.value)}
                        />
                      </FormField>
                      <Button type="submit">Save</Button>
                      <Button type="button" variant="secondary" onClick={cancelEditing}>
                        Cancel
                      </Button>
                    </Form>
                  </Card>
                ) : (
                  <>
                    <Span>
                      <Strong>{word.term}</Strong> – {word.definition} (mastery:{' '}
                      {word.masteryLevel})
                    </Span>
                    <Span>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => startEditing(word)}
                        aria-label={`Edit ${word.term}`}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => deleteWord(word.id)}
                        aria-label={`Delete ${word.term}`}
                      >
                        Delete
                      </Button>
                    </Span>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Section>

      <Section title={`Lists (${state.lists.length})`}>
        <Text>
          Create themed lists (e.g. &quot;Spanish 101&quot;) to group words. You can assign a list to a word when adding it later.
        </Text>
        <Form onSubmit={handleAddList}>
          <Input
            type="text"
            placeholder="List name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          />
          <Button type="submit">Add list</Button>
        </Form>
        {state.lists.length > 0 && (
          <List>
            {state.lists.map((list) => (
              <ListItem key={list.id}>{list.name}</ListItem>
            ))}
          </List>
        )}
      </Section>
    </PageLayout>
  )
}

export default VocabularyPage
