import { Link, Routes, Route } from 'react-router-dom'
import Home from './home/Home'
import Upload from './pages/Upload'
import './App.css'

function App() {
  return (
    <div>
      <nav style={{ padding: 12, borderBottom: '1px solid #eee' }}>
        <Link to="/" style={{ marginRight: 12 }}>Home</Link>
        <Link to="/upload">Upload</Link>
      </nav>

      <main style={{ padding: 12 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
