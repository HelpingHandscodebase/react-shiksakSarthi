import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuth } from '../lib/auth'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) return setError('Provide email and password')
    try {
      setLoading(true)
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const json = await res.json()
      if (!res.ok) return setError(json.message || 'Login failed')
      // store token and user
      setAuth(json.token, json.user)
      if (onLogin) onLogin(json.user)
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
        <h2 style={{ marginTop: 0 }}>Sign in</h2>
        <p style={{ color: '#555' }}>Use your account to upload media.</p>
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
          </div>
          {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button type="submit" disabled={loading} style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#4f46e5', color: 'white' }}>{loading ? 'Signing in...' : 'Sign in'}</button>
            <button type="button" onClick={() => navigate('/')} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #ddd', background: 'white' }}>Cancel</button>
            <div style={{ marginLeft: 12 }}>
              <a href="/register">Don't have an account? Register</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
