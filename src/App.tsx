import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import VocabularyPage from './pages/VocabularyPage'
import PracticePage from './pages/PracticePage'

function App() {
  return (
    <div className="app">
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/vocabulary">Vocabulary</Link>
        <Link to="/practice">Practice</Link>
      </nav>
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vocabulary" element={<VocabularyPage />} />
          <Route path="/practice" element={<PracticePage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
