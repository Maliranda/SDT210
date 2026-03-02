import { useState, useCallback } from 'react'
import type { ReactElement } from 'react'
import { useVocabularyBuilderContext } from '../context/VocabularyBuilderContext'
import {
  PageLayout,
  Heading,
  Text,
  AppLink,
  Section,
  Strong,
  Button,
  Card,
  List,
  ListItem,
} from '../components/ui'
import type { VocabularyWord } from '../types'

const QUESTIONS_PER_ROUND = 5

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function pickOptions(correct: VocabularyWord, allWords: VocabularyWord[], count: number): { term: string; wordId: string }[] {
  const wrong = allWords.filter((w) => w.id !== correct.id).map((w) => ({ term: w.term, wordId: w.id }))
  const shuffledWrong = shuffle(wrong).slice(0, count - 1)
  const options = [{ term: correct.term, wordId: correct.id }, ...shuffledWrong]
  return shuffle(options)
}

type Phase = 'idle' | 'active' | 'result'

export function PracticePage(): ReactElement {
  const { state, updateWordMastery, recordPracticeSession } = useVocabularyBuilderContext()
  const words = state.words
  const wordCount = words.length
  const sessionCount = state.sessions.length
  const wordLabel = wordCount === 1 ? 'word' : 'words'
  const sessionLabel = sessionCount === 1 ? 'session' : 'sessions'

  const [phase, setPhase] = useState<Phase>('idle')
  const [roundWords, setRoundWords] = useState<VocabularyWord[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [options, setOptions] = useState<{ term: string; wordId: string }[]>([])
  const [answered, setAnswered] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)
  const [roundCorrect, setRoundCorrect] = useState(0)
  const [roundTotal, setRoundTotal] = useState(0)
  const [resultScore, setResultScore] = useState({ correct: 0, total: 0 })

  const currentWord = roundWords[questionIndex] ?? null
  const totalQuestions = roundWords.length

  const startRound = useCallback(() => {
    if (words.length === 0) return
    const count = Math.min(QUESTIONS_PER_ROUND, words.length)
    const selected = shuffle(words).slice(0, count)
    setRoundWords(selected)
    setRoundTotal(count)
    setRoundCorrect(0)
    setQuestionIndex(0)
    setAnswered(false)
    const first = selected[0]
    if (first) setOptions(pickOptions(first, words, Math.min(4, words.length < 4 ? words.length : 4)))
    setPhase('active')
  }, [words])

  const handleAnswer = useCallback(
    (wordId: string) => {
      if (answered || !currentWord) return
      const correct = wordId === currentWord.id
      setWasCorrect(correct)
      setAnswered(true)
      if (correct) setRoundCorrect((c) => c + 1)
    },
    [answered, currentWord]
  )

  const handleNext = useCallback(() => {
    if (!currentWord) return
    if (wasCorrect && currentWord.masteryLevel < 5) {
      updateWordMastery(currentWord.id, (currentWord.masteryLevel + 1) as 1 | 2 | 3 | 4 | 5)
    }
    if (questionIndex + 1 >= totalQuestions) {
      const finalCorrect = roundCorrect + (wasCorrect ? 1 : 0)
      setResultScore({ correct: finalCorrect, total: roundTotal })
      const session = {
        id: crypto.randomUUID(),
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        mode: 'multiple-choice' as const,
        wordIds: roundWords.map((w) => w.id),
        correctCount: finalCorrect,
        totalCount: roundTotal,
        masteryChanges: [],
      }
      recordPracticeSession(session)
      setPhase('result')
      return
    }
    const nextIndex = questionIndex + 1
    const nextWord = roundWords[nextIndex]
    setQuestionIndex(nextIndex)
    setAnswered(false)
    if (nextWord) setOptions(pickOptions(nextWord, words, Math.min(4, words.length < 4 ? words.length : 4)))
  }, [currentWord, wasCorrect, questionIndex, totalQuestions, roundWords, roundCorrect, roundTotal, words, recordPracticeSession, updateWordMastery])

  return (
    <PageLayout>
      <Heading level={1}>Practice</Heading>
      <Text>
        Practice your vocabulary with multiple choice: see the definition and
        choose the correct term.
      </Text>
      <Text as="span">
        <AppLink to="/">← Back to Home</AppLink>
      </Text>

      <Section title="Overview">
        <Text>
          You have <Strong>{wordCount}</Strong> {wordLabel} in your vocabulary.
        </Text>
        <Text>
          You have completed <Strong>{sessionCount}</Strong> practice{' '}
          {sessionLabel}.
        </Text>
        {wordCount === 0 && (
          <Text>
            <AppLink to="/vocabulary">Add some words</AppLink> before
            practicing.
          </Text>
        )}
      </Section>

      {wordCount >= 1 && phase === 'idle' && (
        <Section title="Multiple choice">
          <Text>You will see a definition and choose the correct term from 4 options.</Text>
          <Button onClick={startRound}>Start practice</Button>
        </Section>
      )}

      {phase === 'active' && currentWord && (
        <Section title={`Question ${questionIndex + 1} of ${totalQuestions}`}>
          <Card>
            <Text>
              <Strong>Definition:</Strong> {currentWord.definition}
            </Text>
            <Text>Choose the correct term:</Text>
            <List>
              {options.map((opt) => (
                <ListItem key={opt.wordId}>
                  <Button
                    variant={answered ? (opt.wordId === currentWord.id ? 'primary' : opt.wordId !== currentWord.id && wasCorrect === false ? 'danger' : 'secondary') : 'secondary'}
                    onClick={() => handleAnswer(opt.wordId)}
                    disabled={answered}
                  >
                    {opt.term}
                  </Button>
                </ListItem>
              ))}
            </List>
            {answered && (
              <Text>
                {wasCorrect ? 'Correct!' : `Wrong. The correct term is: ${currentWord.term}`}
              </Text>
            )}
            {answered && (
              <Button onClick={handleNext}>
                {questionIndex + 1 >= totalQuestions ? 'See results' : 'Next'}
              </Button>
            )}
          </Card>
        </Section>
      )}

      {phase === 'result' && (
        <Section title="Round complete">
          <Card>
            <Text>
              You got <Strong>{resultScore.correct}</Strong> out of <Strong>{resultScore.total}</Strong> correct.
            </Text>
            <Button onClick={startRound}>Practice again</Button>
          </Card>
        </Section>
      )}
    </PageLayout>
  )
}

export default PracticePage
