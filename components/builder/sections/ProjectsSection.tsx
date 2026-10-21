'use client'
import { useRef } from 'react'
import toast from 'react-hot-toast'
import { usePortfolioStore } from '@/store'
import type { AppPage, ProjectImage } from '@/types'
interface Props { navigate: (p: AppPage) => void }
const ICONS = ['🎨','📱','🛒','💡','🚀','🔧','📊','🌐','🎮','📝','🏗','⚡','🔬','🎵','✈️']
const CATS = ['Web Application','Mobile App','Design System','SaaS Product','E-Commerce','Dashboard','API / Backend','Open Source','Branding','Other']

function DropZone({ onFiles }: { onFiles: (f: FileList) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div className="upload-zone" style={{ padding: '1.5rem' }} onClick={() => ref.current?.click()}
      onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLElement).style.borderColor = '#c9a84c' }}
      onDragLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '' }}
      onDrop={e => { e.preventDefault(); (e.currentTarget as HTMLElement).style.borderColor = ''; if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files) }}>
      <input ref={ref} type="file" accept="image/*" multiple className="hidden" style={{ display: 'none' }} onChange={e => e.target.files && onFiles(e.target.files)} />
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</div>
      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Click or drag images here</div>
      <div style={{ color: '#625e58', fontSize: '0.8rem' }}>JPG · PNG · WebP · Max 10MB · Multiple supported</div>
    </div>
  )
}

export default function ProjectsSection({ navigate }: Props) {
  const { portfolio, addProject, updateProject, removeProject, setSection } = usePortfolioStore()

  function handleImages(projectId: string, files: FileList) {
    const proj = portfolio.projects.find(p => p.id === projectId)
    if (!proj) return
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return
      if (file.size > 10 * 1024 * 1024) { toast.error(`${file.name} too large`); return }
      const reader = new FileReader()
      reader.onload = e => {
        const url = e.target?.result as string
        const img: ProjectImage = { id: Date.now().toString() + Math.random(), url, filename: file.name, caption: file.name.replace(/\.[^/.]+$/, ''), alt: file.name, order: (proj.images || []).length, size: file.size, mimetype: file.type }
        updateProject(projectId, { images: [...(proj.images || []), img] })
        toast.success('Image added!')
      }
      reader.readAsDataURL(file)
    })
  }

  function removeImg(projectId: string, imgId: string) {
    const proj = portfolio.projects.find(p => p.id === projectId)
    if (!proj) return
    updateProject(projectId, { images: proj.images.filter(i => i.id !== imgId) })
  }

  function addHL(projectId: string) {
    const p = portfolio.projects.find(p => p.id === projectId)
    if (!p) return
    updateProject(projectId, { highlights: [...(p.highlights || []), ''] })
  }

  function updateHL(projectId: string, idx: number, val: string) {
    const p = portfolio.projects.find(p => p.id === projectId)
    if (!p) return
    const h = [...(p.highlights || [])]; h[idx] = val
    updateProject(projectId, { highlights: h })
  }

  function removeHL(projectId: string, idx: number) {
    const p = portfolio.projects.find(p => p.id === projectId)
    if (!p) return
    updateProject(projectId, { highlights: p.highlights.filter((_, i) => i !== idx) })
  }

  return (
    <div>
      {portfolio.projects.map((p, idx) => (
        <div key={p.id} className="form-section">
          <div className="form-section-head">
            <span>{p.icon || '💡'}</span> Project {idx + 1}{p.name ? ` — ${p.name}` : ''}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span onClick={() => { updateProject(p.id, { featured: !p.featured }); toast.success(p.featured ? 'Removed from featured' : 'Marked as featured!') }}
                className={`chip cursor-pointer select-none ${p.featured ? 'chip-gold' : ''}`} style={{ cursor: 'pointer' }}>
                {p.featured ? '⭐ Featured' : '☆ Feature'}
              </span>
              {portfolio.projects.length > 1 && <button className="btn-ghost btn-sm" onClick={() => { removeProject(p.id); toast.success('Removed') }}>Remove</button>}
            </div>
          </div>

          <div className="form-grid" style={{ marginBottom: '1.25rem' }}>
            <div><label className="form-label">Project Name</label><input className="form-input" value={p.name} onChange={e => updateProject(p.id, { name: e.target.value })} placeholder="Project name" /></div>
            <div><label className="form-label">Tech Stack</label><input className="form-input" value={p.stack} onChange={e => updateProject(p.id, { stack: e.target.value })} placeholder="React · Node.js · Stripe" /></div>
            <div><label className="form-label">Category</label>
              <select className="form-select" value={p.category || 'Web Application'} onChange={e => updateProject(p.id, { category: e.target.value })}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="form-label">Year</label><input className="form-input" value={p.year || ''} onChange={e => updateProject(p.id, { year: e.target.value })} placeholder="2024" /></div>
            <div style={{ gridColumn: '1/-1' }}><label className="form-label">Your Role</label><input className="form-input" value={p.role || ''} onChange={e => updateProject(p.id, { role: e.target.value })} placeholder="e.g. Lead Designer & Developer" /></div>
            <div style={{ gridColumn: '1/-1' }}><label className="form-label">Short Description <span style={{ color: '#625e58', fontWeight: 400, textTransform: 'none' }}>(shown on card)</span></label>
              <textarea className="form-textarea" style={{ minHeight: 80 }} value={p.desc} onChange={e => updateProject(p.id, { desc: e.target.value })} placeholder="1-2 sentences about what you built..." /></div>
            <div style={{ gridColumn: '1/-1' }}><label className="form-label">Full Case Study <span style={{ color: '#625e58', fontWeight: 400, textTransform: 'none' }}>(shown on detail page)</span></label>
              <textarea className="form-textarea" style={{ minHeight: 130 }} value={p.longDesc || ''} onChange={e => updateProject(p.id, { longDesc: e.target.value })} placeholder="Problem, approach, technology decisions, challenges, outcomes..." /></div>
            <div><label className="form-label">Live URL</label><input className="form-input" value={p.liveUrl} onChange={e => updateProject(p.id, { liveUrl: e.target.value })} placeholder="https://..." /></div>
            <div><label className="form-label">GitHub URL</label><input className="form-input" value={p.githubUrl} onChange={e => updateProject(p.id, { githubUrl: e.target.value })} placeholder="https://github.com/..." /></div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Icon</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {ICONS.map(icon => (
                <button key={icon} onClick={() => updateProject(p.id, { icon })} style={{ width: 40, height: 40, borderRadius: 8, fontSize: '1.2rem', border: `2px solid ${p.icon === icon ? '#c9a84c' : 'rgba(255,255,255,0.1)'}`, background: p.icon === icon ? 'rgba(201,168,76,0.12)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>{icon}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Key Achievements <span style={{ color: '#625e58', fontWeight: 400, textTransform: 'none' }}>(bullet points on detail page)</span></label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              {(p.highlights || []).map((h, hi) => (
                <div key={hi} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ color: '#c9a84c', flexShrink: 0 }}>✦</span>
                  <input className="form-input" style={{ flex: 1 }} value={h} onChange={e => updateHL(p.id, hi, e.target.value)} placeholder="e.g. Increased conversion by 35%..." />
                  <button onClick={() => removeHL(p.id, hi)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'none', color: '#625e58', cursor: 'pointer', flexShrink: 0 }}>×</button>
                </div>
              ))}
              <button className="btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => addHL(p.id)}>+ Add Highlight</button>
            </div>
          </div>

          <div>
            <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
              Project Images <span style={{ color: '#625e58', fontWeight: 400, textTransform: 'none' }}>({(p.images || []).length} · shown in carousel on detail page)</span>
            </label>
            <DropZone onFiles={f => handleImages(p.id, f)} />
            {(p.images || []).length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(100px,1fr))', gap: '0.75rem', marginTop: '1rem' }}>
                {p.images.map((img, ii) => (
                  <div key={img.id} style={{ position: 'relative' }} className="group">
                    <div style={{ aspectRatio: '16/9', borderRadius: 9, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#1f1f30', position: 'relative' }}>
                      <img src={img.url} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: 4, left: 4, width: 18, height: 18, borderRadius: '50%', background: 'rgba(8,8,13,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, color: '#c9a84c' }}>{ii + 1}</div>
                      <button onClick={() => removeImg(p.id, img.id)} style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: '50%', background: 'rgba(239,68,68,0.9)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </div>
                    <input style={{ width: '100%', marginTop: '0.375rem', background: '#191926', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '3px 6px', color: '#9b9488', fontSize: '0.72rem', outline: 'none' }} value={img.caption} onChange={e => { const proj = portfolio.projects.find(pr => pr.id === p.id); if (proj) updateProject(p.id, { images: proj.images.map(i => i.id === img.id ? { ...i, caption: e.target.value } : i) }) }} placeholder="Caption..." />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button className="btn-ghost btn-sm" onClick={() => { addProject(); toast.success('New project added!') }}>+ Add Another Project</button>
        <span style={{ color: '#625e58', fontSize: '0.8rem' }}>{portfolio.projects.length} project{portfolio.projects.length !== 1 ? 's' : ''}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <button className="btn-ghost btn-sm" onClick={() => setSection('skills')}>← Back</button>
        <button className="btn-primary btn-sm" onClick={() => { setSection('experience'); toast.success('Projects saved!') }}>Save & Continue →</button>
      </div>
    </div>
  )
}
