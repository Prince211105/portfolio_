'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { usePortfolioStore } from '@/store'
import type { AppPage } from '@/types'

interface Props { navigate: (p: AppPage) => void }

export default function DashboardPage({ navigate }: Props) {
  const { portfolio, saveToLocal, backupPortfolio, restorePortfolio, resetPortfolio } = usePortfolioStore()
  const [canRestore, setCanRestore] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCanRestore(!!window.localStorage.getItem('portfolioforge-v2-backup'))
    }
  }, [])

  function handleNew() {
    if (portfolio.name) {
      if (!confirm('Start a new portfolio? Your current draft will be backed up and can be restored later.')) return
      backupPortfolio()
      setCanRestore(true)
    }
    resetPortfolio()
    navigate('templates')
  }

  return (
    <div style={{ paddingTop: 66, minHeight: '100vh' }}>
      {/* Top bar */}
      <div style={{ background: '#0e0e16', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '1.5rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', fontWeight: 700 }}>Dashboard</h1>
          <p style={{ color: '#625e58', fontSize: '0.82rem', marginTop: 2 }}>
            {portfolio.name ? `Working on: ${portfolio.name}` : 'No portfolio yet — create one!'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn-ghost btn-sm" onClick={() => navigate('landing')}>← Home</button>
          <button className="btn-ghost btn-sm" onClick={() => navigate('templates')}>🎨 Templates</button>
          <button className="btn-primary btn-sm" onClick={handleNew}>+ New Portfolio</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 2rem' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {[['Name', portfolio.name || '—'],['Role', portfolio.role || '—'],['Skills', portfolio.skills.length.toString()],['Projects', portfolio.projects.length.toString()]].map(([l, v]) => (
            <div key={l} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ color: '#625e58', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>{l}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', fontWeight: 700, color: '#e2c06a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Current portfolio card */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '1.25rem' }}>Current Portfolio</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.5rem' }}>
            {portfolio.name ? (
              <div className="card card-hover" style={{ padding: '1.75rem' }}>
                <div style={{ height: 120, borderRadius: 10, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', border: '1px solid rgba(255,255,255,0.07)', background: 'linear-gradient(135deg,rgba(201,168,76,0.08),rgba(139,92,246,0.05))' }}>
                  {portfolio.theme.accent === 'gold' ? '🌙' : portfolio.theme.accent === 'purple' ? '💜' : portfolio.theme.accent === 'teal' ? '🟢' : portfolio.theme.accent === 'rose' ? '🌹' : portfolio.theme.accent === 'sky' ? '🔵' : '🔥'}
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.375rem' }}>{portfolio.name}</div>
                <div style={{ color: '#625e58', fontSize: '0.8rem', marginBottom: '1.25rem' }}>{portfolio.role || 'No role set'} · {portfolio.theme.style.replace('-', ' ')}</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span className="chip chip-gold">{portfolio.theme.style.replace('-',' ')}</span>
                  <span className="chip">{portfolio.projects.length} projects</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => navigate('builder')}>✏ Edit</button>
                  <button className="btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => navigate('preview')}>👁 Preview</button>
                  <button className="btn-primary btn-sm" style={{ flex: 1 }} onClick={() => navigate('export')}>📦 Export</button>
                </div>
              </div>
            ) : null}

            {/* New portfolio card */}
            <div
              onClick={handleNew}
              style={{ border: '2px dashed rgba(201,168,76,0.25)', borderRadius: 18, padding: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', minHeight: 240, gap: '0.875rem', transition: 'all 0.3s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#c9a84c'; (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.05)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.25)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <div style={{ fontSize: '2rem', color: '#625e58' }}>+</div>
              <div style={{ fontWeight: 600, color: '#9b9488' }}>Create New Portfolio</div>
              <div style={{ color: '#625e58', fontSize: '0.875rem' }}>Pick a template to get started</div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '1.5rem' }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem' }}>
            {[
              { icon: '🎨', label: 'Browse Templates', action: () => navigate('templates') },
              { icon: '✨', label: 'AI Prompt Mode', action: () => navigate('aimode') },
              { icon: '💾', label: 'Save Progress', action: () => { saveToLocal(); toast.success('Saved!') } },
              { icon: '👁', label: 'Preview Portfolio', action: () => navigate('preview') },
              { icon: '📦', label: 'Export HTML', action: () => navigate('export') },
            ].map(a => (
              <button key={a.label} onClick={a.action} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem', background: 'none', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.25)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.background = 'none' }}>
                <span style={{ fontSize: '1.5rem' }}>{a.icon}</span>
                <span style={{ color: '#9b9488', fontSize: '0.9rem', fontWeight: 500 }}>{a.label}</span>
              </button>
            ))}
          </div>
          {canRestore ? (
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <button className="btn-ghost btn-sm" onClick={() => { restorePortfolio(); setCanRestore(false); toast.success('Last portfolio restored') }}>
                Restore Last Portfolio Draft
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
