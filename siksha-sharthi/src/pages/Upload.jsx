import { useEffect, useState } from 'react'
import { getToken, getUser } from '../lib/auth'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function Upload() {
  const [files, setFiles] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const user = getUser()

  useEffect(() => {
    fetchList()
  }, [])

  async function fetchList() {
    try {
      setLoading(true)
      const res = await fetch(`${API}/api/media`)
      const data = await res.json()
      setItems(data.items || [])
    } catch (err) {
      console.error(err)
      setMessage('Failed to fetch list')
    } finally {
      setLoading(false)
    }
  }

  function onFileChange(e) {
    setFiles(Array.from(e.target.files || []))
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (!files.length) return setMessage('Please choose at least one file')

    const fd = new FormData()
    files.forEach((f) => fd.append('file', f))

    try {
      setLoading(true)
      setMessage('')
      const headers = {}
      const token = getToken()
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch(`${API}/api/media/upload`, {
        method: 'POST',
        headers,
        body: fd
      })

      const json = await res.json()
      if (!res.ok) {
        setMessage(json.message || 'Upload failed')
      } else {
        setMessage(`Uploaded ${json.uploaded ? json.uploaded.length : 0} files`)
        setFiles([])
        // refresh list
        fetchList()
      }
    } catch (err) {
      console.error(err)
      setMessage('Upload error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <h2>Upload files</h2>
      
      <form onSubmit={onSubmit} style={{ marginBottom: 18 }}>
        <div style={{ marginBottom: 8 }}>
          {user ? (
            <div style={{ marginBottom: 8 }}>
              Logged in as <strong>{user.name}</strong> — <small>{user.email}</small>
            </div>
          ) : (
            <div style={{ marginBottom: 8 }}>
              <a href="/login">Log in</a> to upload files as an authenticated user.
            </div>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <input type="file" multiple onChange={onFileChange} />
        </div>

        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </form>

      {message && <div style={{ marginBottom: 12 }}>{message}</div>}

      <section>
        <h3>Uploaded items</h3>
        {loading && <div>Loading list...</div>}
        {!loading && items.length === 0 && <div>No uploaded items found.</div>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 160px)', gap: 12 }}>
          {items.map((it) => (
            <div key={it._id} style={{ border: '1px solid #eee', padding: 8 }}>
              {it.resource_type && it.resource_type.startsWith('image') ? (
                <img src={it.url} alt={it.public_id || it._id} style={{ width: '100%', height: 100, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{it.format || it.resource_type}</div>
              )}
              <div style={{ fontSize: 12, marginTop: 6 }}>{new Date(it.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
