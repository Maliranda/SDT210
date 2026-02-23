import { Link } from 'react-router-dom'

function PracticePage() {
  return (
    <div className="page">
      <h1>Practice</h1>
      <p>
        Practice your vocabulary with multiple choice, fill-in-the-blank, and
        matching modes. Take quizzes with a configurable number of questions.
        Spaced practice prioritizes low-mastery and recently-missed words, and
        session statistics track accuracy and mastery changes.
      </p>
      <p>
        <Link to="/">← Back to Home</Link>
      </p>
    </div>
  )
}

export default PracticePage
