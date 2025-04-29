import React, { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { getCSRFToken } from '../../utils/csrf'
import { FaTrash } from 'react-icons/fa6'

interface FeedbackItem {
  id: number
  user: string
  title: string
  description: string
  response: string | null
  created_at: string
  responded_at: string | null
}

interface UserProfile {
  username: string
  email: string
  is_staff: boolean
  groups: string[]
}

const Feedback: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [replyMap, setReplyMap] = useState<Record<number, string>>({})
  const nav = useNavigate()

  useEffect(() => {
    async function bootstrap() {
      let u: UserProfile
      try {
        const res = await fetch('http://localhost:8000/auth/user/', { credentials: 'include' })
        if (!res.ok) throw new Error('not authenticated')
        u = await res.json()
      } catch {
        u = { username: 'Anonymous', email: '', is_staff: false, groups: [] }
      }
      setUser(u)

      const fbRes = await fetch('http://localhost:8000/feedback/', { credentials: 'include' })
      if (fbRes.ok) {
        const data: FeedbackItem[] = await fbRes.json()
        setFeedbacks(data)
      }
    }

    bootstrap()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const csrfToken = await getCSRFToken()

    const postRes = await fetch('http://localhost:8000/feedback/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({ title, description }),
    })

    if (!postRes.ok) return

    setTitle('')
    setDescription('')

    if (user && (user.is_staff || user.groups.includes('admin'))) {
      const fbRes = await fetch('http://localhost:8000/feedback/', { credentials: 'include' })
      if (fbRes.ok) setFeedbacks(await fbRes.json())
    } else {
      nav({ to: '/' })
    }
  }

  const handleReplyChange = (id: number, value: string) => {
    setReplyMap(prev => ({ ...prev, [id]: value }))
  }

  const handleReplySubmit = async (id: number) => {
    const csrfToken = await getCSRFToken()
    const responseText = replyMap[id]

    const res = await fetch(`http://localhost:8000/feedback/${id}/reply/`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({ response: responseText }),
    })

    if (res.ok) {
      const updated = await res.json()
      setFeedbacks(fb => fb.map(item => item.id === id ? updated : item))
      setReplyMap(prev => ({ ...prev, [id]: '' }))
    }
  }

  const handleDelete = async (id: number) => {
    if (!user || !(user.is_staff || user.groups.includes('admin'))) return
    const csrfToken = await getCSRFToken()
    const res = await fetch(`http://localhost:8000/feedback/${id}/`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'X-CSRFToken': csrfToken },
    })
    if (res.ok) {
      setFeedbacks(fb => fb.filter(item => item.id !== id))
    }
  }

  if (!user) return <div>Loading…</div>

  const visibleFeedback = (user.is_staff || user.groups.includes('admin'))
    ? feedbacks
    : feedbacks.filter(fb => fb.user === user.username)

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Submit Feedback</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <label>
          Title<br />
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </label>
        <br /><br />
        <label>
          Description<br />
          <textarea
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={5}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </label>
        <br /><br />
        <button type="submit">Send Feedback</button>
      </form>

      <h2>Feedback List</h2>
      {visibleFeedback.length === 0 && <p>No feedback found.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {visibleFeedback.map(fb => (
          <li key={fb.id} style={{ borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{fb.title}</strong>
              {user.is_staff || user.groups.includes('admin') ? (
                <FaTrash
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDelete(fb.id)}
                  title="Delete feedback"
                />
              ) : null}
            </div>
            <em>by {fb.user} on {new Date(fb.created_at).toLocaleString()}</em>
            <p>{fb.description}</p>

            {fb.response ? (
              <p><strong>Response:</strong> {fb.response}</p>
            ) : (user.is_staff || user.groups.includes('admin')) && (
              <div style={{ marginTop: '0.5rem' }}>
                <textarea
                  placeholder="Write your response..."
                  value={replyMap[fb.id] || ''}
                  onChange={e => handleReplyChange(fb.id, e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
                <button onClick={() => handleReplySubmit(fb.id)} style={{ marginTop: '0.5rem' }}>
                  Submit Reply
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Feedback
