'use client'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import type { AppPage } from '@/types'

interface Props { currentPage: AppPage; navigate: (p: AppPage) => void }

export default function Navbar({ currentPage, navigate }: Props) {
  const { data: session, status } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links: { label: string; page: AppPage }[] = [
    { label: 'Home', page: 'landing' },
    { label: 'Templates', page: 'templates' },
    { label: 'Dashboard', page: 'dashboard' },
    { label: 'Builder', page: 'builder' },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
        height: 66, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2.5rem',
        background: scrolled ? 'rgba(8,8,13,0.97)' : 'rgba(8,8,13,0.8)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        transition: 'all 0.3s',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.4)' : 'none',
      }}>
        <button onClick={() => navigate('landing')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Playfair Display',serif", fontSize: '1.45rem', fontWeight: 700, background: 'linear-gradient(135deg,#c9a84c,#f0d898)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          PortfolioForge
        </button>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '0.25rem' }} className="hidden-mobile">
          {links.map(l => (
            <button key={l.page} onClick={() => navigate(l.page)} style={{
              background: currentPage === l.page ? 'rgba(201,168,76,0.12)' : 'transparent',
              border: 'none', color: currentPage === l.page ? '#c9a84c' : '#9b9488',
              padding: '0.5rem 0.875rem', borderRadius: 8, fontSize: '0.875rem',
              fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { if (currentPage !== l.page) (e.target as HTMLElement).style.color = '#c9a84c' }}
              onMouseLeave={e => { if (currentPage !== l.page) (e.target as HTMLElement).style.color = '#9b9488' }}
            >{l.label}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }} className="hidden-mobile">
          {status === 'authenticated' && session?.user ? (
            <button className="btn-ghost btn-sm" onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</button>
          ) : (
            <button className="btn-ghost btn-sm" onClick={() => window.location.href = '/auth/login'}>Sign In</button>
          )}
          <button className="btn-primary btn-sm" onClick={() => navigate('templates')}>Start Building →</button>
        </div>

        {/* Hamburger */}
        <button className="show-mobile" onClick={() => setMobileOpen(v => !v)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#edeae4', width: 38, height: 38, borderRadius: 8, cursor: 'pointer', fontSize: '1.1rem' }}>☰</button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ position: 'fixed', top: 66, left: 0, right: 0, zIndex: 490, background: '#0e0e16', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {links.map(l => (
            <button key={l.page} onClick={() => { navigate(l.page); setMobileOpen(false) }} style={{ background: 'none', border: 'none', color: '#9b9488', textAlign: 'left', padding: '0.75rem 1rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.9rem' }}>{l.label}</button>
          ))}
          {status === 'authenticated' && session?.user ? (
            <button className="btn-ghost" style={{ marginTop: '0.5rem' }} onClick={() => { signOut({ callbackUrl: '/' }); setMobileOpen(false) }}>Sign Out</button>
          ) : (
            <button className="btn-ghost" style={{ marginTop: '0.5rem' }} onClick={() => { window.location.href = '/auth/login'; setMobileOpen(false) }}>Sign In</button>
          )}
          <button className="btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => { navigate('templates'); setMobileOpen(false) }}>Start Building →</button>
        </div>
      )}

      <style>{`
        @media(max-width:768px){.hidden-mobile{display:none!important}.show-mobile{display:flex!important;align-items:center;justify-content:center}}
        @media(min-width:769px){.show-mobile{display:none!important}}
      `}</style>
    </>
  )
}
