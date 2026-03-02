import { useVocabularyBuilderContext } from '../context/VocabularyBuilderContext'
import {
  PageLayout,
  Heading,
  Text,
  AppLink,
  List,
  ListItem,
  Strong,
} from '../components/ui'

function HomePage() {
  const { state } = useVocabularyBuilderContext()
  const wordLabel = state.words.length === 1 ? 'word' : 'words'
  const listLabel = state.lists.length === 1 ? 'list' : 'lists'

  return (
    <PageLayout>
      <Heading level={1}>Vocabulary Builder</Heading>
      <Text>
        Learn vocabulary with definitions, practice modes, and mastery levels.
        Add words, organize them into lists, and track your progress.
      </Text>
      <Text>
        You have <Strong>{state.words.length}</Strong> {wordLabel} and{' '}
        <Strong>{state.lists.length}</Strong> {listLabel}.
      </Text>
      <List>
        <ListItem>
          <AppLink to="/vocabulary">Vocabulary</AppLink>
          {' – '}
          Add, edit, and browse your words; filter by mastery or list.
        </ListItem>
        <ListItem>
          <AppLink to="/practice">Practice</AppLink>
          {' – '}
          Multiple choice, fill-in-the-blank, matching, and quiz mode.
        </ListItem>
      </List>
    </PageLayout>
  )
}

export default HomePage
