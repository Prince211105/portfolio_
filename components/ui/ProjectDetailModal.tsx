'use client'
import { useEffect } from 'react'
import ImageCarousel from './ImageCarousel'
import type { Project } from '@/types'

interface Props {
  project: Project
  accent: string
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
  hasPrev?: boolean
  hasNext?: boolean
}

export default function ProjectDetailModal({ project: p, accent, onClose, onPrev, onNext, hasPrev, hasNext }: Props) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && hasNext) onNext?.()
      if (e.key === 'ArrowLeft'  && hasPrev) onPrev?.()
    }
    window.addEventListener('keydown', h)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', h) }
  }, [onClose, onPrev, onNext, hasPrev, hasNext])

  const acDim  = `${accent}18`
  const acBord = `${accent}40`

  return (
    <div style={{ position:'fixed', inset:0, zIndex:500, background:'rgba(0,0,0,0.88)', backdropFilter:'blur(10px)', display:'flex', alignItems:'flex-start', justifyContent:'center', overflowY:'auto', padding:'1.5rem 1rem' }}
      onClick={onClose}>
      <div style={{ width:'100%', maxWidth:900, background:'#0e0e16', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, overflow:'hidden', boxShadow:'0 40px 120px rgba(0,0,0,0.8)', margin:'auto' }}
        onClick={e => e.stopPropagation()}>

        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.25rem 2rem', background:'#13131e', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.875rem' }}>
            <span style={{ fontSize:'1.75rem' }}>{p.icon || '💡'}</span>
            <div>
              <div style={{ fontWeight:700, fontSize:'1.05rem' }}>{p.name}</div>
              <div style={{ color:accent, fontSize:'0.78rem', marginTop:2 }}>{p.category}{p.year ? ` · ${p.year}` : ''}</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
            {hasPrev && <button onClick={onPrev} style={{ background:'none', border:'1px solid rgba(255,255,255,0.1)', color:'#9b9488', padding:'0.5rem 0.875rem', borderRadius:8, cursor:'pointer', fontSize:'0.875rem' }}>‹ Prev</button>}
            {hasNext && <button onClick={onNext} style={{ background:'none', border:'1px solid rgba(255,255,255,0.1)', color:'#9b9488', padding:'0.5rem 0.875rem', borderRadius:8, cursor:'pointer', fontSize:'0.875rem' }}>Next ›</button>}
            <button onClick={onClose} style={{ width:36, height:36, borderRadius:9, border:'1px solid rgba(255,255,255,0.1)', background:'none', color:'#9b9488', fontSize:'1.25rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
          </div>
        </div>

        <div style={{ padding:'2rem' }}>
          {/* Carousel */}
          <ImageCarousel images={p.images || []} projectName={p.name} />

          {/* Stack chips */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'1.5rem' }}>
            {p.stack.split('·').map(s => s.trim()).filter(Boolean).map(s => (
              <span key={s} style={{ background:acDim, border:`1px solid ${acBord}`, color:accent, borderRadius:100, padding:'3px 12px', fontSize:12, fontWeight:600 }}>{s}</span>
            ))}
            {p.featured && <span style={{ background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.3)', color:'#a78bfa', borderRadius:100, padding:'3px 12px', fontSize:12, fontWeight:600 }}>⭐ Featured</span>}
          </div>

          {/* Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 270px', gap:'2rem' }}>
            <div>
              {/* Overview */}
              <div style={{ marginBottom:'1.75rem' }}>
                <div style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:accent, marginBottom:'0.75rem' }}>Overview</div>
                <p style={{ color:'#9b9488', fontSize:'0.9rem', lineHeight:1.8 }}>{p.desc}</p>
              </div>

              {/* Case study */}
              {p.longDesc && (
                <div style={{ marginBottom:'1.75rem' }}>
                  <div style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:accent, marginBottom:'0.75rem' }}>Case Study</div>
                  <p style={{ color:'#9b9488', fontSize:'0.875rem', lineHeight:1.85, whiteSpace:'pre-line' }}>{p.longDesc}</p>
                </div>
              )}

              {/* Highlights */}
              {p.highlights && p.highlights.length > 0 && (
                <div>
                  <div style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:accent, marginBottom:'0.875rem' }}>Key Achievements</div>
                  {p.highlights.map((h, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'0.75rem', color:'#9b9488', fontSize:'0.875rem', marginBottom:'0.75rem' }}>
                      <span style={{ color:accent, fontSize:'1rem', flexShrink:0, marginTop:2 }}>✦</span>{h}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Side panel */}
            <div>
              {p.role && (
                <div style={{ background:'#13131e', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'1.25rem', marginBottom:'1rem' }}>
                  <div style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#625e58', marginBottom:'0.375rem' }}>My Role</div>
                  <div style={{ fontWeight:600, fontSize:'0.9rem' }}>{p.role}</div>
                </div>
              )}
              <div style={{ background:'#13131e', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'1.25rem', marginBottom:'1rem' }}>
                <div style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#625e58', marginBottom:'0.375rem' }}>Category</div>
                <div style={{ fontWeight:600, fontSize:'0.9rem' }}>{p.category}</div>
                <div style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#625e58', margin:'0.875rem 0 0.375rem' }}>Year</div>
                <div style={{ fontWeight:600, fontSize:'0.9rem' }}>{p.year || '—'}</div>
              </div>
              {p.images.length > 0 && (
                <div style={{ background:'#13131e', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'1.25rem', marginBottom:'1rem' }}>
                  <div style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#625e58', marginBottom:'0.375rem' }}>Images</div>
                  <div style={{ fontWeight:600, fontSize:'0.9rem' }}>{p.images.length} image{p.images.length !== 1 ? 's' : ''}</div>
                </div>
              )}
              {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'0.7rem', borderRadius:10, fontWeight:700, fontSize:'0.875rem', textDecoration:'none', background:`linear-gradient(135deg,${accent},${accent}88)`, color:'#080810', marginBottom:'0.625rem', transition:'all 0.2s' }}>↗ View Live Site</a>}
              {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'0.7rem', borderRadius:10, fontWeight:600, fontSize:'0.875rem', textDecoration:'none', background:'transparent', color:'#9b9488', border:'1px solid rgba(255,255,255,0.1)', transition:'all 0.2s' }}>⌥ View on GitHub</a>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding:'1rem 2rem', borderTop:'1px solid rgba(255,255,255,0.07)', background:'#13131e', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ color:'#625e58', fontSize:'0.8rem' }}>Press ESC to close · ← → to navigate projects</span>
          <button onClick={onClose} style={{ background:'none', border:'1px solid rgba(255,255,255,0.1)', color:'#9b9488', padding:'0.5rem 1rem', borderRadius:8, cursor:'pointer', fontSize:'0.875rem' }}>Close</button>
        </div>
      </div>
    </div>
  )
}
