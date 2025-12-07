import { useState } from 'react'
import { Link, Routes, Route, useNavigate } from 'react-router-dom'
import Home from './home/Home'
import Upload from './pages/Upload'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'
import { getUser, clearAuth } from './lib/auth'

function App() {
  const [user, setUser] = useState(getUser())
  const navigate = useNavigate()

  function handleLogout() {
    clearAuth()
    setUser(null)
    navigate('/')
  }

  return (
    <div>
      <nav style={{ padding: 12, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Link to="/" style={{ marginRight: 12 }}>Home</Link>
          <Link to="/upload">Upload</Link>
        </div>
        <div>
          {user ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, color: '#333' }}>Hi, <strong>{user.name}</strong></span>
              <button onClick={handleLogout} style={{ marginLeft: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', background: 'white' }}>Logout</button>
            </span>
          ) : (
            <span style={{ display: 'inline-flex', gap: 12 }}>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </span>
          )}
        </div>
      </nav>

      <main style={{ padding: 12 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/register" element={<Register onRegister={setUser} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
