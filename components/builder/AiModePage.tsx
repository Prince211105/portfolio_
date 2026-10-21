'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { usePortfolioStore } from '@/store'
import type { AppPage } from '@/types'

interface Props { navigate: (p: AppPage) => void }

const TEMPLATES = [
  { label: '👨‍💻 Developer', prompt: "I'm a full-stack developer with 5 years of experience in React, Node.js, and cloud infrastructure. I've built SaaS products and developer tooling. I want a minimal dark portfolio with teal accents focused on my GitHub projects and technical writing." },
  { label: '🎨 Designer',   prompt: "I'm a UX/UI designer with 4 years specialising in mobile apps and design systems. My work shipped to millions of users. I want an elegant portfolio with purple accents, a focus on case studies and process documentation." },
  { label: '📷 Photographer', prompt: "I'm a freelance photographer with 6 years of portrait and commercial work. I want a gallery-heavy dark cinematic portfolio with rose accents and a minimal contact section." },
  { label: '📝 Writer',     prompt: "I'm a freelance content strategist and writer. I've written for top tech publications. I want a clean light editorial portfolio with gold serif fonts showing my writing samples and client list." },
]

export default function AiModePage({ navigate }: Props) {
  const [tab, setTab]         = useState<'prompt'|'photo'>('prompt')
  const [prompt, setPrompt]   = useState('')
  const [loading, setLoading] = useState(false)
  const { updateField, updateTheme }  = usePortfolioStore()

  async function generate() {
    if (!prompt.trim()) { toast.error('Write a description first'); return }
    setLoading(true)
    const id = toast.loading('AI is building your portfolio...')
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate-from-prompt', data: { prompt } }),
      })
      const data = await res.json()
      if (data.portfolio) {
        const p = data.portfolio
        if (p.name)      updateField('name', p.name)
        if (p.role)      updateField('role', p.role)
        if (p.headline)  updateField('headline', p.headline)
        if (p.about)     updateField('about', p.about)
        if (p.skills)    updateField('skills', p.skills)
        if (p.tools)     updateField('tools', p.tools)
        if (p.services)  updateField('services', p.services)
        if (p.theme)     updateTheme(p.theme)
        toast.dismiss(id)
        toast.success('Portfolio generated! Review and customise in the builder.')
        navigate('builder')
      } else {
        throw new Error('No portfolio data returned')
      }
    } catch {
      toast.dismiss(id)
      // Fallback — navigate to builder with prompt as about
      updateField('about', prompt)
      toast.success('Prompt saved! Fill in the rest in the builder.')
      navigate('builder')
    } finally {
      setLoading(false)
    }
  }

  function generateFromPhotos() {
    toast.success('Photos saved! Fill in the rest in the builder.')
    navigate('builder')
  }

  return (
    <div style={{ paddingTop: 66, minHeight: '100vh' }}>
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '3.5rem 2rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#8b5cf6,#4c1d95)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem', boxShadow: '0 8px 40px rgba(139,92,246,0.4)' }}>✨</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>AI Portfolio Generator</h1>
          <p style={{ color: '#9b9488', maxWidth: 480, margin: '0 auto', lineHeight: 1.75 }}>
            Describe yourself in plain language and let AI build your entire portfolio — content, layout, and style included.
          </p>
        </div>

        {/* Tabs */}
        <div className="tab-wrap" style={{ marginBottom: '1.75rem' }}>
          <button className={`tab-btn ${tab==='prompt'?'active':''}`} onClick={() => setTab('prompt')}>💬 Prompt Mode</button>
          <button className={`tab-btn ${tab==='photo'?'active':''}`}  onClick={() => setTab('photo')}>📸 Photo + Bio</button>
        </div>

        {/* Prompt tab */}
        {tab === 'prompt' && (
          <div className="card" style={{ padding: '2rem' }}>
            <label className="form-label" style={{ marginBottom: '0.875rem', display: 'block' }}>Describe your portfolio in as much detail as you like</label>
            <textarea className="form-textarea" style={{ minHeight: 220, fontSize: '0.95rem', lineHeight: 1.75 }} value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Example: I'm a senior UX designer with 8 years of experience at startups. I specialise in design systems and mobile apps. I want a dark portfolio with purple accents showcasing my case studies, with a strong hero section and minimal contact form. Professional but warm tone." />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <p style={{ color: '#625e58', fontSize: '0.82rem' }}>💡 More detail = better result. Include role, style, tone, and any specific sections you want.</p>
              <button className="btn-primary" onClick={generate} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Generating...' : '✨ Generate Portfolio'}
              </button>
            </div>

            {/* Template prompts */}
            <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Quick Start Templates</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '0.75rem' }}>
                {TEMPLATES.map(t => (
                  <button key={t.label} className="card" onClick={() => { setPrompt(t.prompt); toast.success('Template loaded!') }}
                    style={{ padding: '1rem', textAlign: 'left', background: 'none', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.375rem' }}>{t.label}</div>
                    <div style={{ color: '#625e58', fontSize: '0.78rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{t.prompt.slice(0,80)}...</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Photo tab */}
        {tab === 'photo' && (
          <div className="card" style={{ padding: '2rem' }}>
            <div className="upload-zone" style={{ marginBottom: '1.5rem' }} onClick={() => toast.success('Photo upload ready!')}>
              <div style={{ fontSize: '2.75rem', marginBottom: '1rem' }}>🖼</div>
              <div style={{ fontWeight: 600, marginBottom: '0.375rem' }}>Upload your photos, project screenshots, or inspiration</div>
              <div style={{ color: '#625e58', fontSize: '0.85rem' }}>JPG · PNG · WebP · Multiple files · Max 10MB each</div>
            </div>
            <div>
              <label className="form-label">Brief Description</label>
              <textarea className="form-textarea" style={{ marginTop: '0.5rem' }} placeholder="Tell us who you are and what you do. Even a few sentences works..." />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button className="btn-primary" onClick={generateFromPhotos}>✨ Generate from Photos</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
          <button className="btn-outline" onClick={() => navigate('builder')}>← Use Form Builder Instead</button>
        </div>
      </div>
    </div>
  )
}
