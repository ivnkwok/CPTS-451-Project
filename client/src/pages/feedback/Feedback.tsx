// src/components/feedback/Feedback.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { getCSRFToken } from '../../utils/csrf'

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

      if (u.is_staff || u.groups.includes('admin')) {
        const fbRes = await fetch('http://localhost:8000/feedback/', { credentials: 'include' })
        if (fbRes.ok) {
          const data: FeedbackItem[] = await fbRes.json()
          setFeedbacks(data)
        }
      }
    }
  
    bootstrap()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const csrfToken = await getCSRFToken();

    const postRes = await fetch("http://localhost:8000/feedback/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({ title, description }),
    });
  
    if (!postRes.ok) {
      // show error
      return;
    }
  
    setTitle("");
    setDescription("");
  
    if (user && (user.is_staff || user.groups.includes("admin"))) {
      const fbRes = await fetch("http://localhost:8000/feedback/", { credentials: "include" });
      if (fbRes.ok) setFeedbacks(await fbRes.json());
    } else {
      nav({ to: "/" });
    }
  };

  if (!user) return <div>Loading…</div>

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

      {(user.is_staff || user.groups.includes('admin')) && (
        <>
          <h2>All Feedback</h2>
          {feedbacks.length === 0 && <p>No feedback submitted yet.</p>}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {feedbacks.map(fb => (
              <li key={fb.id} style={{ borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
                <strong>{fb.title}</strong> <em>by {fb.user} on {new Date(fb.created_at).toLocaleString()}</em>
                <p>{fb.description}</p>
                {fb.response
                  ? <p><strong>Response:</strong> {fb.response}</p>
                  : <em>No response yet.</em>
                }
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default Feedback
