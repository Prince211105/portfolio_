'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await response.json()
    setLoading(false)

    if (!response.ok) {
      toast.error(data.error || 'Registration failed. Please try again.')
      return
    }

    toast.success('Account created. Please log in.')
    router.push('/auth/login')
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 520, background: '#0f1119', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '2.25rem', boxShadow: '0 24px 80px rgba(0,0,0,0.35)' }}>
        <h1 style={{ marginBottom: '0.75rem', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Create your PortfolioForge account</h1>
        <p style={{ marginBottom: '1.75rem', color: '#b9b3a9' }}>Register with email and password to create your first portfolio.</p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <label style={{ display: 'grid', gap: '0.5rem', fontSize: '0.95rem', color: '#d8d3cb' }}>
            Name
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Your name"
              style={{ width: '100%', padding: '0.95rem 1rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.12)', background: '#12131b', color: '#edeae4' }}
            />
          </label>

          <label style={{ display: 'grid', gap: '0.5rem', fontSize: '0.95rem', color: '#d8d3cb' }}>
            Email
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{ width: '100%', padding: '0.95rem 1rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.12)', background: '#12131b', color: '#edeae4' }}
            />
          </label>

          <label style={{ display: 'grid', gap: '0.5rem', fontSize: '0.95rem', color: '#d8d3cb' }}>
            Password
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="At least 8 characters"
              style={{ width: '100%', padding: '0.95rem 1rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.12)', background: '#12131b', color: '#edeae4' }}
            />
          </label>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '1rem', borderRadius: 14, border: 'none', background: '#c9a84c', color: '#08080d', fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', fontSize: '0.95rem', color: '#aea295', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <span>Already have an account?</span>
          <Link href="/auth/login" style={{ color: '#c9a84c', textDecoration: 'none' }}>Sign in</Link>
        </div>
      </div>
    </main>
  )
}
