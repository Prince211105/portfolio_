'use client'
import { useState, useEffect, useCallback } from 'react'
import type { ProjectImage } from '@/types'

interface Props { images: ProjectImage[]; projectName: string }

export default function ImageCarousel({ images, projectName }: Props) {
  const [cur, setCur]       = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [fading, setFading] = useState(false)
  const total = images.length

  const go = useCallback((dir: 'prev'|'next') => {
    if (fading || total <= 1) return
    setFading(true)
    setTimeout(() => setFading(false), 280)
    setCur(c => dir === 'next' ? (c+1)%total : (c-1+total)%total)
  }, [fading, total])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go('next')
      if (e.key === 'ArrowLeft')  go('prev')
      if (e.key === 'Escape')     setZoomed(false)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [go])

  // Auto-play when not zoomed
  useEffect(() => {
    if (zoomed || total <= 1) return
    const t = setInterval(() => go('next'), 4500)
    return () => clearInterval(t)
  }, [go, zoomed, total])

  if (!total) {
    return (
      <div style={{ aspectRatio:'16/9', borderRadius:14, background:'#191926', border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.5rem' }}>
        <div style={{ textAlign:'center', color:'#625e58' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>🖼</div>
          <div style={{ fontSize:'0.85rem' }}>No images uploaded</div>
        </div>
      </div>
    )
  }

  const img = images[cur]

  return (
    <>
      {/* Main carousel */}
      <div style={{ position:'relative', borderRadius:14, overflow:'hidden', background:'#191926', border:'1px solid rgba(255,255,255,0.07)', marginBottom: total > 1 ? '0.75rem' : '1.5rem' }}
        className="carousel-wrap">
        <div style={{ aspectRatio:'16/9', position:'relative', overflow:'hidden' }}>
          <img src={img.url} alt={img.alt}
            style={{ width:'100%', height:'100%', objectFit:'cover', opacity: fading ? 0 : 1, transition:'opacity 0.28s', cursor:'zoom-in' }}
            onClick={() => setZoomed(true)} />

          {/* Gradient */}
          <div style={{ position:'absolute', inset:'0 0 0 0', background:'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)', pointerEvents:'none' }} />

          {/* Caption */}
          {img.caption && <div style={{ position:'absolute', bottom:'0.875rem', left:'1rem', right:'3.5rem', color:'white', fontSize:'0.85rem', fontWeight:500 }}>{img.caption}</div>}

          {/* Counter */}
          <div style={{ position:'absolute', top:'0.875rem', right:'0.875rem', background:'rgba(0,0,0,0.7)', backdropFilter:'blur(4px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:100, padding:'0.2rem 0.75rem', fontSize:'0.75rem', color:'rgba(255,255,255,0.7)' }}>
            {cur+1} / {total}
          </div>

          {/* Zoom btn */}
          <button onClick={() => setZoomed(true)} style={{ position:'absolute', top:'0.875rem', left:'0.875rem', width:32, height:32, borderRadius:8, background:'rgba(0,0,0,0.7)', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.7)', cursor:'pointer', fontSize:'0.9rem', display:'flex', alignItems:'center', justifyContent:'center' }} title="Fullscreen">⛶</button>

          {/* Prev/Next */}
          {total > 1 && <>
            <button onClick={() => go('prev')} style={{ position:'absolute', left:'0.5rem', top:'50%', transform:'translateY(-50%)', width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,0.7)', border:'1px solid rgba(255,255,255,0.15)', color:'white', cursor:'pointer', fontSize:'1.1rem', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>‹</button>
            <button onClick={() => go('next')} style={{ position:'absolute', right:'0.5rem', top:'50%', transform:'translateY(-50%)', width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,0.7)', border:'1px solid rgba(255,255,255,0.15)', color:'white', cursor:'pointer', fontSize:'1.1rem', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>›</button>
          </>}

          {/* Dots */}
          {total > 1 && (
            <div style={{ position:'absolute', bottom:'0.875rem', right:'0.875rem', display:'flex', gap:'0.375rem' }}>
              {images.map((_,i) => (
                <button key={i} onClick={() => setCur(i)} style={{ height:4, borderRadius:100, border:'none', cursor:'pointer', transition:'all 0.2s', background: i===cur ? '#c9a84c' : 'rgba(255,255,255,0.4)', width: i===cur ? 14 : 6, padding:0 }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail strip */}
      {total > 1 && (
        <div style={{ display:'flex', gap:'0.5rem', overflowX:'auto', padding:'0.125rem 0.125rem 1.25rem', scrollbarWidth:'none' }}>
          {images.map((img, i) => (
            <button key={img.id} onClick={() => setCur(i)} style={{ flexShrink:0, width:70, height:46, borderRadius:7, overflow:'hidden', cursor:'pointer', border:`2px solid ${i===cur?'#c9a84c':'transparent'}`, opacity: i===cur?1:0.55, transform: i===cur?'scale(1.05)':'none', transition:'all 0.2s', padding:0, background:'transparent' }}>
              <img src={img.url} alt={img.alt} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen lightbox */}
      {zoomed && (
        <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.96)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}
          onClick={() => setZoomed(false)}>
          <button onClick={() => setZoomed(false)} style={{ position:'absolute', top:'1.25rem', right:'1.25rem', width:40, height:40, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.2)', background:'none', color:'white', fontSize:'1.5rem', cursor:'pointer', zIndex:1 }}>×</button>
          {total > 1 && <>
            <button onClick={e => { e.stopPropagation(); go('prev') }} style={{ position:'absolute', left:'1.25rem', top:'50%', transform:'translateY(-50%)', width:48, height:48, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.2)', background:'none', color:'white', fontSize:'1.5rem', cursor:'pointer' }}>‹</button>
            <button onClick={e => { e.stopPropagation(); go('next') }} style={{ position:'absolute', right:'1.25rem', top:'50%', transform:'translateY(-50%)', width:48, height:48, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.2)', background:'none', color:'white', fontSize:'1.5rem', cursor:'pointer' }}>›</button>
          </>}
          <img src={img.url} alt={img.alt} onClick={e => e.stopPropagation()}
            style={{ maxWidth:'90vw', maxHeight:'75vh', objectFit:'contain', borderRadius:12, boxShadow:'0 25px 80px rgba(0,0,0,0.8)' }} />
          {img.caption && <div style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.875rem', marginTop:'0.875rem' }}>{img.caption}</div>}
          <div style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.75rem', marginTop:'0.375rem' }}>{cur+1} / {total} · ← → navigate · ESC close</div>
          {total > 1 && (
            <div style={{ position:'absolute', bottom:'1.5rem', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'0.5rem' }} onClick={e => e.stopPropagation()}>
              {images.map((t, i) => (
                <button key={t.id} onClick={() => setCur(i)} style={{ width:56, height:36, borderRadius:6, overflow:'hidden', border:`2px solid ${i===cur?'#c9a84c':'rgba(255,255,255,0.2)'}`, opacity: i===cur?1:0.5, cursor:'pointer', padding:0, background:'transparent' }}>
                  <img src={t.url} alt={t.alt} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
