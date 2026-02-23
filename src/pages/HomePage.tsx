import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className="page">
      <h1>Vocabulary Builder</h1>
      <p>
        Learn vocabulary with definitions, practice modes, and mastery levels.
        Add words, organize them into lists, and track your progress.
      </p>
      <ul>
        <li>
          <Link to="/vocabulary">Vocabulary</Link> – Add, edit, and browse your
          words; filter by mastery or list.
        </li>
        <li>
          <Link to="/practice">Practice</Link> – Multiple choice, fill-in-the-blank,
          matching, and quiz mode.
        </li>
      </ul>
    </div>
  )
}

export default HomePage
