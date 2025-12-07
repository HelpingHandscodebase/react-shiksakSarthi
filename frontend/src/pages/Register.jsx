import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuth } from '../lib/auth'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function Register({ onRegister }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!name || !email || !password) return setError('Please fill all fields')
    try {
      setLoading(true)
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const json = await res.json()
      if (!res.ok) return setError(json.message || 'Registration failed')
      setAuth(json.token, json.user)
      if (onRegister) onRegister(json.user)
      navigate('/upload')
    } catch (err) {
      console.error(err)
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <div style={{ padding: 24, borderRadius: 12, boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}>
        <h2 style={{ marginTop: 0 }}>Create an account</h2>
        <p style={{ color: '#555' }}>Register to upload and manage your media.</p>
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
          </div>
          {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={loading} style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#10b981', color: 'white' }}>{loading ? 'Creating...' : 'Create account'}</button>
            <button type="button" onClick={() => navigate('/login')} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #ddd', background: 'white' }}>Already have an account?</button>
          </div>
        </form>
      </div>
    </div>
  )
}
