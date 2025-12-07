import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function Upload() {
  const [files, setFiles] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchList()
  }, [])

  async function fetchList() {
    try {
      setLoading(true)
      // Fetch list directly from Cloudinary via backend endpoint
      const res = await fetch(`${API}/api/media/cloudinary`)
      const data = await res.json()
      // cloudinary.api.resources returns an object with a `resources` array
      const resources = data.resources || []
      // normalize resource shape to match UI (`_id`, `url`, `public_id`, `resource_type`, `format`, `createdAt`)
      const normalized = resources.map((r) => ({
        _id: r.asset_id || r.public_id || `${r.public_id}-${r.filename}`,
        url: r.secure_url || r.url || r.secure_url_https || '',
        public_id: r.public_id,
        resource_type: r.resource_type || r.type || 'unknown',
        format: r.format,
        createdAt: r.created_at || r.created_at
      }))
      setItems(normalized)
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

      const res = await fetch(`${API}/api/media/upload`, {
        method: 'POST',
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
