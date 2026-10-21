'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { usePortfolioStore } from '@/store'
import { getInitials } from '@/lib/utils'
import ProjectDetailModal from '@/components/ui/ProjectDetailModal'
import type { AppPage, PreviewMode, Project } from '@/types'

interface Props { navigate: (p: AppPage) => void }

const ACCENT_MAP: Record<string, string> = {
  gold: '#c9a84c', purple: '#8b5cf6', teal: '#0d9488',
  rose: '#f43f5e', sky: '#0ea5e9', orange: '#f97316', green: '#22c55e',
}

const THEME_COLORS: Record<string, { bg: string; bg2: string; bg3: string; bg4: string; text: string; text2: string; text3: string; border: string; isLight: boolean }> = {
  'dark-luxury':    { bg:'#08080d', bg2:'#0e0e16', bg3:'#13131e', bg4:'#191926', text:'#edeae4', text2:'#9b9488', text3:'#625e58', border:'rgba(255,255,255,0.07)', isLight:false },
  'light-minimal':  { bg:'#f8fafc', bg2:'#f1f5f9', bg3:'#ffffff', bg4:'#e2e8f0', text:'#1e293b', text2:'#475569', text3:'#94a3b8', border:'rgba(0,0,0,0.08)',       isLight:true  },
  'bold-creative':  { bg:'#0d0820', bg2:'#180d2e', bg3:'#1e0f38', bg4:'#2a1550', text:'#edeae4', text2:'#9b9488', text3:'#625e58', border:'rgba(255,255,255,0.07)', isLight:false },
  'tech-clean':     { bg:'#080c14', bg2:'#0d1628', bg3:'#111e35', bg4:'#162540', text:'#edeae4', text2:'#9b9488', text3:'#625e58', border:'rgba(255,255,255,0.07)', isLight:false },
  'warm-editorial': { bg:'#0d0a06', bg2:'#1a1208', bg3:'#231a0a', bg4:'#2e2210', text:'#edeae4', text2:'#9b9488', text3:'#625e58', border:'rgba(255,255,255,0.07)', isLight:false },
}

const FONT_MAP: Record<string, string> = {
  playfair: "'Playfair Display', serif",
  space:    "'Space Grotesk', sans-serif",
  syne:     "'Syne', sans-serif",
  dm:       "'DM Sans', sans-serif",
}

export default function PreviewPage({ navigate }: Props) {
  const { portfolio, previewMode, setPreviewMode, updateField } = usePortfolioStore()
  const [activeProject, setActiveProject]   = useState<Project | null>(null)
  const [activeProjectIdx, setActiveProjectIdx] = useState(0)

  const widths: Record<PreviewMode, string> = { desktop: '100%', tablet: '768px', mobile: '390px' }
  const initials = getInitials(portfolio.name || 'Me')
  const showProfilePhoto = Boolean(portfolio.profilePhoto && portfolio.showProfilePhoto)
  const accent   = ACCENT_MAP[portfolio.theme.accent] || '#c9a84c'
  const thm      = THEME_COLORS[portfolio.theme.style] || THEME_COLORS['dark-luxury']
  const fontHead = FONT_MAP[portfolio.theme.font] || FONT_MAP.playfair

  function openProject(proj: Project, idx: number) {
    setActiveProject(proj)
    setActiveProjectIdx(idx)
  }

  function navProject(dir: 'prev' | 'next') {
    const projects = portfolio.projects
    const newIdx = dir === 'next'
      ? (activeProjectIdx + 1) % projects.length
      : (activeProjectIdx - 1 + projects.length) % projects.length
    setActiveProject(projects[newIdx])
    setActiveProjectIdx(newIdx)
  }

  const s = thm
  const acDim  = `${accent}18`
  const acBord = `${accent}40`

  return (
    <div style={{ paddingTop: 66, minHeight: '100vh' }}>

      {/* Project Detail Modal */}
      {activeProject && (
        <ProjectDetailModal
          project={activeProject}
          accent={accent}
          onClose={() => setActiveProject(null)}
          onPrev={() => navProject('prev')}
          onNext={() => navProject('next')}
          hasPrev={portfolio.projects.length > 1}
          hasNext={portfolio.projects.length > 1}
        />
      )}

      <div style={{ padding: '1.5rem 2rem' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-ghost btn-sm" onClick={() => navigate('builder')}>← Edit</button>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.35rem', fontWeight: 700 }}>Live Preview</span>
            <span className="badge" style={{ fontSize: '0.7rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9a84c', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              Live
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="tab-wrap">
              {(['desktop','tablet','mobile'] as PreviewMode[]).map(m => (
                <button key={m} className={`tab-btn ${previewMode === m ? 'active' : ''}`}
                  onClick={() => { setPreviewMode(m); toast.success(`${m.charAt(0).toUpperCase()+m.slice(1)} view`) }}>
                  {m === 'desktop' ? '🖥' : m === 'tablet' ? '📟' : '📱'} {m.charAt(0).toUpperCase()+m.slice(1)}
                </button>
              ))}
            </div>
            <button className="btn-primary btn-sm" onClick={() => navigate('export')}>Export Code →</button>
          </div>
        </div>

        {/* Browser shell */}
        <div style={{ background: '#13131e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 8px 48px rgba(0,0,0,0.6)' }}>
          {/* Browser bar */}
          <div style={{ background: '#191926', padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
            </div>
            <div style={{ background: '#1f1f30', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, padding: '0.35rem 1rem', fontSize: '0.8rem', color: '#625e58', flex: 1, maxWidth: 380 }}>
              {portfolio.name ? portfolio.name.toLowerCase().replace(/\s+/g, '') + '.portfolioforge.app' : 'portfolioforge.app/preview'}
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
              <button className="btn-ghost btn-sm" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }} onClick={() => toast.success('Refreshed!')}>↻</button>
            </div>
          </div>

          {/* Preview frame */}
          <div style={{ padding: '1.5rem', background: s.bg }}>
            <div style={{ maxWidth: widths[previewMode], margin: '0 auto', transition: 'max-width 0.4s ease', overflow: 'hidden', borderRadius: 10, border: `1px solid ${s.border}` }}>
              {/* ── RENDERED PORTFOLIO ── */}
              <PortfolioRender
                d={portfolio} s={s} accent={accent} acDim={acDim} acBord={acBord}
                initials={initials} fontHead={fontHead} showProfilePhoto={showProfilePhoto}
                onProjectClick={openProject}
              />
            </div>
          </div>
        </div>

        {/* Quick Edit */}
        <div className="card" style={{ marginTop: '1.5rem', padding: '1.75rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '1.25rem', fontSize: '0.95rem' }}>
            ✏ Quick Edit <span style={{ color: '#625e58', fontSize: '0.82rem', fontWeight: 400 }}>(updates preview instantly)</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div><label className="form-label">Name</label><input className="form-input" value={portfolio.name} onChange={e => updateField('name', e.target.value)} /></div>
            <div><label className="form-label">Role</label><input className="form-input" value={portfolio.role} onChange={e => updateField('role', e.target.value)} /></div>
            <div><label className="form-label">Headline</label><input className="form-input" value={portfolio.headline} onChange={e => updateField('headline', e.target.value)} /></div>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  )
}

/* ── Inline Portfolio Renderer ─────────────────────────────── */
function PortfolioRender({ d, s, accent, acDim, acBord, initials, fontHead, showProfilePhoto, onProjectClick }: {
  d: any; s: any; accent: string; acDim: string; acBord: string
  initials: string; fontHead: string
  showProfilePhoto: boolean
  onProjectClick: (p: Project, idx: number) => void
}) {
  const T = (extra?: any) => ({ fontFamily: "'DM Sans',sans-serif", color: s.text, ...extra })

  return (
    <div style={T({ background: s.bg, fontSize: 14, lineHeight: 1.65 })}>

      {/* NAV */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${s.border}`, background: s.isLight ? 'rgba(248,250,252,0.92)' : 'rgba(8,8,13,0.92)', backdropFilter: 'blur(16px)' }}>
        <span style={{ fontFamily: fontHead, fontWeight: 700, fontSize: 15, background: `linear-gradient(135deg,${accent},${accent}cc)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{d.name || 'Your Name'}</span>
        <div style={{ display: 'flex', gap: 18 }}>
          {['About','Work','Skills','Contact'].map(l => <span key={l} style={{ color: s.text2, fontSize: 12, cursor: 'pointer' }}>{l}</span>)}
        </div>
      </div>

      {/* HERO */}
      {d.sections.hero && (
        <div style={{ padding: '56px 28px 48px', textAlign: 'center', background: `radial-gradient(ellipse 80% 50% at 50% -10%, ${accent}12, transparent)` }}>
          {showProfilePhoto && d.profilePhoto ? (
            <img src={d.profilePhoto} alt={d.name || 'Profile photo'} style={{ width: 84, height: 84, borderRadius: '50%', objectFit: 'contain', objectPosition: 'center', background: '#f5f5f5', padding: 2, transform: 'scale(1.02)', display: 'block', margin: '0 auto 20px', border: `3px solid ${acBord}`, boxShadow: `0 0 40px ${acDim}` }} />
          ) : (
            <div style={{ width: 84, height: 84, borderRadius: '50%', background: `linear-gradient(135deg,${accent},#8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fontHead, fontSize: 26, fontWeight: 900, color: '#080810', margin: '0 auto 20px', border: `3px solid ${acBord}`, boxShadow: `0 0 40px ${acDim}` }}>{initials}</div>
          )}
          <h1 style={{ fontFamily: fontHead, fontSize: 28, fontWeight: 900, margin: '0 0 6px', background: `linear-gradient(135deg,${accent},${accent}cc)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{d.name || 'Your Name'}</h1>
          <div style={{ color: accent, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{d.role || 'Your Role'}</div>
          <p style={{ color: s.text2, fontSize: 13, maxWidth: 460, margin: '0 auto 22px', lineHeight: 1.75 }}>{d.headline || 'Your headline here...'}</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{ background: `linear-gradient(135deg,${accent},${accent}88)`, color: '#080810', border: 'none', padding: '8px 18px', borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>View My Work</button>
            <button style={{ background: 'transparent', color: s.text, border: `1px solid ${acBord}`, padding: '8px 18px', borderRadius: 9, fontSize: 12, cursor: 'pointer' }}>Get In Touch</button>
          </div>
        </div>
      )}

      {/* ABOUT */}
      {d.sections.about && (
        <div style={{ padding: '28px 28px', borderTop: `1px solid ${s.border}` }}>
          <div style={{ fontFamily: fontHead, fontSize: 17, fontWeight: 700, marginBottom: 14 }}>
            <span style={{ background: `linear-gradient(135deg,${accent},${accent}cc)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>About</span> Me
          </div>
          <p style={{ color: s.text2, fontSize: 13, lineHeight: 1.85, maxWidth: 640 }}>{d.about || 'Your bio will appear here...'}</p>
          {d.achievements?.length > 0 && (
            <div style={{ marginTop: 14 }}>
              {d.achievements.map((a: string) => (
                <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 10, color: s.text2, fontSize: 12, padding: '7px 10px', background: acDim, border: `1px solid ${acBord}`, borderRadius: 8, marginBottom: 5 }}>
                  <span style={{ color: accent }}>★</span>{a}
                </div>
              ))}
            </div>
          )}
          {d.certifications?.length > 0 && (
            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {d.certifications.map((c: string) => (
                <span key={c} style={{ background: 'rgba(139,92,246,.1)', border: '1px solid rgba(139,92,246,.2)', color: '#a78bfa', borderRadius: 100, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>🏅 {c}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SKILLS */}
      {d.sections.skills && (
        <div style={{ padding: '28px', borderTop: `1px solid ${s.border}` }}>
          <div style={{ fontFamily: fontHead, fontSize: 17, fontWeight: 700, marginBottom: 14 }}>
            <span style={{ background: `linear-gradient(135deg,${accent},${accent}cc)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Skills</span> & Tools
          </div>
          {d.skills.length === 0 && d.tools.length === 0 && <p style={{ color: s.text3, fontSize: 13 }}>Add your skills in the builder...</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {d.skills.map((sk: string) => (
              <span key={sk} style={{ background: acDim, border: `1px solid ${acBord}`, color: accent, borderRadius: 7, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{sk}</span>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {d.tools.map((t: string) => (
              <span key={t} style={{ background: 'rgba(139,92,246,.1)', border: '1px solid rgba(139,92,246,.2)', color: '#a78bfa', borderRadius: 7, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* PROJECTS */}
      {d.sections.projects && (
        <div style={{ padding: '28px', borderTop: `1px solid ${s.border}` }}>
          <div style={{ fontFamily: fontHead, fontSize: 17, fontWeight: 700, marginBottom: 16 }}>
            Featured <span style={{ background: `linear-gradient(135deg,${accent},${accent}cc)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Projects</span>
          </div>
          {d.projects.length === 0 && <p style={{ color: s.text3, fontSize: 13 }}>Add projects in the builder...</p>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
            {d.projects.map((proj: Project, idx: number) => {
              const firstImg = proj.images && proj.images.length > 0 ? proj.images[0] : null
              return (
                <div key={proj.id} onClick={() => onProjectClick(proj, idx)}
                  style={{ background: s.bg3, border: `1px solid ${s.border}`, borderRadius: 13, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.25s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = acBord; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 8px 30px rgba(0,0,0,0.4)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = s.border; el.style.transform = 'none'; el.style.boxShadow = 'none' }}>
                  {/* Image / placeholder */}
                  <div style={{ height: 130, background: s.bg4, position: 'relative', overflow: 'hidden' }}>
                    {firstImg ? (
                      <img src={firstImg.url} alt={firstImg.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>{proj.icon || '💡'}</div>
                    )}
                    {proj.category && <div style={{ position: 'absolute', top: 7, left: 7, background: 'rgba(0,0,0,0.7)', borderRadius: 100, padding: '2px 7px', fontSize: 10, color: 'rgba(255,255,255,0.85)' }}>{proj.category}</div>}
                    {proj.featured && <div style={{ position: 'absolute', top: 7, right: 7, background: acDim, border: `1px solid ${acBord}`, borderRadius: 100, padding: '2px 7px', fontSize: 10, color: accent, fontWeight: 700 }}>⭐</div>}
                    {proj.images.length > 1 && <div style={{ position: 'absolute', bottom: 6, right: 8, background: 'rgba(0,0,0,0.7)', borderRadius: 100, padding: '1px 6px', fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>📸 {proj.images.length}</div>}
                    <div style={{ position: 'absolute', inset: 0, background: `${accent}08`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} className="proj-hover-overlay">
                      <span style={{ background: 'rgba(0,0,0,0.75)', color: 'white', borderRadius: 7, padding: '4px 12px', fontSize: 11, fontWeight: 600 }}>View Details →</span>
                    </div>
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{proj.name}</div>
                    <div style={{ color: s.text3, fontSize: 11, marginBottom: 6 }}>{proj.stack}</div>
                    <div style={{ color: s.text2, fontSize: 12, lineHeight: 1.6 }}>{proj.desc.length > 80 ? proj.desc.slice(0,80)+'...' : proj.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* EXPERIENCE */}
      {d.sections.experience && d.experience.length > 0 && (
        <div style={{ padding: '28px', borderTop: `1px solid ${s.border}` }}>
          <div style={{ fontFamily: fontHead, fontSize: 17, fontWeight: 700, marginBottom: 16 }}>
            Work <span style={{ background: `linear-gradient(135deg,${accent},${accent}cc)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Experience</span>
          </div>
          {d.experience.map((e: any) => (
            <div key={e.id} style={{ borderBottom: `1px solid ${s.border}`, paddingBottom: 14, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4, marginBottom: 3 }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{e.title}</span>
                <span style={{ color: accent, fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {e.current && <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, display: 'inline-block' }} />}
                  {e.period}
                </span>
              </div>
              <div style={{ color: s.text2, fontSize: 12, marginBottom: 4 }}>{e.company}</div>
              <div style={{ color: s.text3, fontSize: 12, lineHeight: 1.65 }}>{e.desc}</div>
            </div>
          ))}
        </div>
      )}

      {/* EDUCATION */}
      {d.sections.education && d.education.length > 0 && (
        <div style={{ padding: '28px', borderTop: `1px solid ${s.border}` }}>
          <div style={{ fontFamily: fontHead, fontSize: 17, fontWeight: 700, marginBottom: 16 }}>
            <span style={{ background: `linear-gradient(135deg,${accent},${accent}cc)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Education</span>
          </div>
          {d.education.map((e: any) => (
            <div key={e.id} style={{ borderBottom: `1px solid ${s.border}`, paddingBottom: 12, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4, marginBottom: 3 }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{e.degree}</span>
                <span style={{ color: accent, fontSize: 11, fontWeight: 600 }}>{e.year}</span>
              </div>
              <div style={{ color: s.text2, fontSize: 12 }}>{e.school}</div>
              {e.desc && <div style={{ color: s.text3, fontSize: 11, marginTop: 4 }}>{e.desc}</div>}
            </div>
          ))}
        </div>
      )}

      {/* SERVICES */}
      {d.sections.services && d.services.length > 0 && (
        <div style={{ padding: '28px', borderTop: `1px solid ${s.border}` }}>
          <div style={{ fontFamily: fontHead, fontSize: 17, fontWeight: 700, marginBottom: 16 }}>
            What I <span style={{ background: `linear-gradient(135deg,${accent},${accent}cc)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Offer</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 10 }}>
            {d.services.map((sv: string) => (
              <div key={sv} style={{ background: s.bg3, border: `1px solid ${s.border}`, borderRadius: 9, padding: '14px', textAlign: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = acBord}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = s.border}>
                <div style={{ fontSize: 18, marginBottom: 7 }}>✦</div>
                <div style={{ fontWeight: 700, fontSize: 11 }}>{sv}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TESTIMONIALS */}
      {d.sections.testimonials && d.testimonials.length > 0 && (
        <div style={{ padding: '28px', borderTop: `1px solid ${s.border}` }}>
          <div style={{ fontFamily: fontHead, fontSize: 17, fontWeight: 700, marginBottom: 16 }}>
            What People <span style={{ background: `linear-gradient(135deg,${accent},${accent}cc)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Say</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
            {d.testimonials.map((t: any) => (
              <div key={t.id} style={{ background: s.bg3, border: `1px solid ${s.border}`, borderRadius: 13, padding: '16px' }}>
                <div style={{ color: accent, fontSize: 11, marginBottom: 8 }}>★★★★★</div>
                <p style={{ color: s.text2, fontSize: 12, fontStyle: 'italic', lineHeight: 1.7, marginBottom: 12 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#080810', flexShrink: 0 }}>{t.initials}</div>
                  <div><div style={{ fontWeight: 600, fontSize: 11 }}>{t.name}</div><div style={{ color: s.text3, fontSize: 10 }}>{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTACT */}
      {d.sections.contact && (
        <div style={{ padding: '36px 28px', textAlign: 'center', background: s.bg2, borderTop: `1px solid ${s.border}` }}>
          <div style={{ fontFamily: fontHead, fontSize: 20, fontWeight: 700, color: accent, marginBottom: 8 }}>Let's Work Together</div>
          <p style={{ color: s.text2, fontSize: 13, marginBottom: 18 }}>Open to freelance, full-time, and collaboration opportunities.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360, margin: '0 auto' }}>
            {['Your name','Your email'].map(ph => (
              <input key={ph} readOnly placeholder={ph} style={{ background: s.bg3, border: `1px solid ${acBord}`, borderRadius: 9, padding: '8px 12px', color: s.text3, fontSize: 12, width: '100%', outline: 'none' }} />
            ))}
            <textarea readOnly placeholder="Your message..." style={{ background: s.bg3, border: `1px solid ${acBord}`, borderRadius: 9, padding: '8px 12px', color: s.text3, fontSize: 12, minHeight: 70, resize: 'none', width: '100%' }} />
            <button style={{ background: `linear-gradient(135deg,${accent},${accent}88)`, color: '#080810', border: 'none', padding: 10, borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Send Message</button>
          </div>
          <p style={{ color: s.text3, fontSize: 12, marginTop: 14 }}>{d.email}{d.location ? ` · ${d.location}` : ''}</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 14 }}>
            {['in','GH','𝕏','✉'].map(ico => (
              <div key={ico} style={{ width: 34, height: 34, borderRadius: '50%', background: s.bg3, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: s.text2, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = acBord; el.style.color = accent }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = s.border; el.style.color = s.text2 }}>{ico}</div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ background: s.bg2, borderTop: `1px solid ${s.border}`, padding: '12px 24px', textAlign: 'center', color: s.text3, fontSize: 11 }}>
        © {new Date().getFullYear()} {d.name || 'Portfolio'} · Built with <span style={{ color: accent }}>PortfolioForge</span>
      </div>
    </div>
  )
}
