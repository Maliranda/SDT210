import { Link } from 'react-router-dom'

function VocabularyPage() {
  return (
    <div className="page">
      <h1>Vocabulary</h1>
      <p>
        Manage your vocabulary words: add new terms with definitions and example
        sentences, edit or delete existing ones, and organize words into themed
        lists. Filter by mastery level (new, learning, familiar, mastered) and
        search by term or definition.
      </p>
      <p>
        <Link to="/">← Back to Home</Link>
      </p>
    </div>
  )
}

export default VocabularyPage
