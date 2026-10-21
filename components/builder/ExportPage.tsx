'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { usePortfolioStore } from '@/store'
import { generatePortfolioHTML, getInitials } from '@/lib/utils'
import type { AppPage } from '@/types'

interface Props { navigate: (p: AppPage) => void }

export default function ExportPage({ navigate }: Props) {
  const { portfolio, updateField, saveToLocal } = usePortfolioStore()
  const [downloading, setDownloading] = useState(false)
  const initials = getInitials(portfolio.name || 'Me')

  /* ── Download HTML file ─────────────────────────────────── */
  function downloadHTML() {
    if (!portfolio.name) {
      toast.error('Please add your name before exporting')
      navigate('builder')
      return
    }
    setDownloading(true)
    toast.loading('Generating your portfolio...', { id: 'dl' })
    setTimeout(() => {
      try {
        const html = generatePortfolioHTML(portfolio)
        const blob = new Blob([html], { type: 'text/html' })
        const url  = URL.createObjectURL(blob)
        const a    = document.createElement('a')
        a.href     = url
        a.download = `${portfolio.name.replace(/\s+/g, '-').toLowerCase()}-portfolio.html`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.dismiss('dl')
        toast.success('Portfolio downloaded! 🎉')
        // Log export
        fetch('/api/export', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ portfolioId: 'local', format: 'HTML' }) }).catch(() => {})
      } catch (err) {
        toast.dismiss('dl')
        toast.error('Export failed. Please try again.')
      } finally {
        setDownloading(false)
      }
    }, 600)
  }

  /* ── Copy code to clipboard ─────────────────────────────── */
  function copyCode() {
    if (!portfolio.name) { toast.error('Add your name first'); return }
    toast.loading('Preparing code...', { id: 'copy' })
    setTimeout(() => {
      const html = generatePortfolioHTML(portfolio)
      if (navigator.clipboard) {
        navigator.clipboard.writeText(html).then(() => {
          toast.dismiss('copy')
          toast.success('Code copied to clipboard! 📋')
        })
      } else {
        const ta = document.createElement('textarea')
        ta.value = html
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        toast.dismiss('copy')
        toast.success('Code copied! 📋')
      }
    }, 400)
  }

  /* ── Deploy to Vercel ───────────────────────────────────── */
  function deployVercel() {
    toast.success('Opening Vercel...', { icon: '🚀' })
    setTimeout(() => window.open('https://vercel.com/new', '_blank'), 500)
  }

  const accentMap: Record<string, string> = {
    gold: '#c9a84c', purple: '#8b5cf6', teal: '#0d9488',
    rose: '#f43f5e', sky: '#0ea5e9', orange: '#f97316', green: '#22c55e',
  }
  const accent = accentMap[portfolio.theme.accent] || '#c9a84c'

  const EXPORT_CARDS = [
    {
      icon: '🌐', title: 'HTML / CSS / JS',
      desc: 'One standalone file. Works on GitHub Pages, Netlify, S3, Cloudflare — anywhere.',
      btn: downloading ? 'Generating...' : '⬇ Download HTML',
      available: true,
      onClick: downloadHTML,
    },
    {
      icon: '📋', title: 'Copy Source Code',
      desc: 'Copy the complete HTML to clipboard and paste it anywhere you like.',
      btn: '📋 Copy to Clipboard',
      available: true,
      onClick: copyCode,
    },
    {
      icon: '🚀', title: 'Deploy to Vercel',
      desc: 'One-click deploy. Upload your HTML file and go live in under a minute.',
      btn: '🚀 Open Vercel',
      available: true,
      onClick: deployVercel,
    },
    {
      icon: '⚛️', title: 'React / Next.js',
      desc: 'Full component-based React project with Tailwind CSS. Upgrade to Pro.',
      btn: 'Coming Soon',
      available: false,
      onClick: () => toast('React export coming soon!', { icon: '⭐' }),
    },
  ]

  return (
    <div style={{ paddingTop: 66, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '3.5rem 2rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Export Your Portfolio</h1>
          <p style={{ color: '#9b9488' }}>Your portfolio is ready. Download and deploy anywhere in minutes.</p>
        </div>

        {/* Summary card */}
        {portfolio.name ? (
          <div style={{ background: `linear-gradient(135deg, ${accent}10, rgba(139,92,246,0.05))`, border: `1px solid ${accent}30`, borderRadius: 18, padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2.25rem', flexWrap: 'wrap' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg,${accent},#8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display',serif", fontSize: '1.75rem', fontWeight: 900, color: '#08080d', flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>{portfolio.name}</div>
              <div style={{ color: accent, fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>{portfolio.role}</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="chip chip-gold">{portfolio.theme.style.replace('-',' ')}</span>
                <span className="chip">{Object.values(portfolio.sections).filter(Boolean).length} sections</span>
                <span className="chip">{portfolio.projects.length} project{portfolio.projects.length !== 1 ? 's' : ''}</span>
                <span className="chip">{portfolio.projects.reduce((acc, p) => acc + (p.images?.length || 0), 0)} images</span>
                <span className="chip">Mobile optimised</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button className="btn-ghost btn-sm" onClick={() => navigate('preview')}>👁 Preview</button>
              <button className="btn-ghost btn-sm" onClick={() => navigate('builder')}>✏ Edit</button>
              <button className="btn-ghost btn-sm" onClick={() => { saveToLocal(); toast.success('Saved!') }}>💾 Save</button>
            </div>
          </div>
        ) : (
          <div style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 14, padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Portfolio is empty</div>
              <div style={{ color: '#9b9488', fontSize: '0.875rem' }}>Please fill in your details before exporting.</div>
            </div>
            <button className="btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => navigate('builder')}>Go to Builder →</button>
          </div>
        )}

        {/* Export cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.25rem', marginBottom: '2.25rem' }}>
          {EXPORT_CARDS.map(card => (
            <div key={card.title} className="card" onClick={card.available ? card.onClick : undefined}
              style={{ padding: '2.25rem 1.75rem', textAlign: 'center', cursor: card.available ? 'pointer' : 'default', opacity: card.available ? 1 : 0.5, transition: 'all 0.3s' }}
              onMouseEnter={e => { if (card.available) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.4)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(201,168,76,0.15)' } }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
              <div style={{ fontSize: '2.75rem', marginBottom: '1.1rem' }}>{card.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{card.title}</div>
              <p style={{ color: '#9b9488', fontSize: '0.85rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>{card.desc}</p>
              <button
                onClick={e => { e.stopPropagation(); card.onClick() }}
                disabled={!card.available || downloading}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 9, fontWeight: 700, fontSize: '0.875rem', border: 'none', cursor: card.available ? 'pointer' : 'not-allowed', background: card.available ? `linear-gradient(135deg,${accent},#a87830)` : 'rgba(255,255,255,0.05)', color: card.available ? '#08080d' : '#625e58', transition: 'all 0.2s' }}>
                {card.btn}
              </button>
            </div>
          ))}
        </div>

        {/* SEO & Metadata */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div className="form-section-head" style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <span>🔍</span> SEO & Metadata
          </div>
          <div className="form-grid">
            <div>
              <label className="form-label">Page Title</label>
              <input className="form-input" value={portfolio.seoTitle} onChange={e => updateField('seoTitle', e.target.value)} placeholder={`${portfolio.name || 'Your Name'} — Portfolio`} />
            </div>
            <div>
              <label className="form-label">Meta Description</label>
              <input className="form-input" value={portfolio.seoDesc} onChange={e => updateField('seoDesc', e.target.value)} placeholder="Short description of your portfolio..." />
            </div>
            <div>
              <label className="form-label">OG Image URL <span style={{ color: '#625e58', fontWeight: 400, textTransform: 'none' }}>(social preview)</span></label>
              <input className="form-input" value={portfolio.seoImage} onChange={e => updateField('seoImage', e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className="form-label">Google Analytics ID</label>
              <input className="form-input" value={portfolio.analytics} onChange={e => updateField('analytics', e.target.value)} placeholder="G-XXXXXXXXXX" />
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <button
            className="btn-primary btn-lg"
            onClick={downloadHTML}
            disabled={downloading || !portfolio.name}
            style={{ opacity: (!portfolio.name) ? 0.5 : 1 }}>
            ⬇ Download Portfolio as HTML
          </button>
          <p style={{ color: '#625e58', fontSize: '0.82rem', marginTop: '0.875rem' }}>
            Free · No watermark · Clean code · Host anywhere
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <button className="btn-ghost btn-sm" onClick={() => navigate('preview')}>← Back to Preview</button>
            <button className="btn-ghost btn-sm" onClick={() => navigate('dashboard')}>Go to Dashboard</button>
            <button className="btn-ghost btn-sm" onClick={() => navigate('builder')}>✏ Edit Portfolio</button>
          </div>
        </div>

      </div>
    </div>
  )
}
