'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { usePortfolioStore } from '@/store'
import type { AppPage } from '@/types'
interface Props { navigate: (p: AppPage) => void }
export default function SkillsSection({ navigate }: Props) {
  const { portfolio, addSkill, removeSkill, addTool, removeTool, setSection } = usePortfolioStore()
  const [si, setSi] = useState(''), [ti, setTi] = useState('')
  function addS() { const v = si.trim(); if (!v) return; addSkill(v); setSi(''); toast.success(`Added: ${v}`) }
  function addT() { const v = ti.trim(); if (!v) return; addTool(v); setTi(''); toast.success(`Added: ${v}`) }
  return (
    <div>
      <div className="form-section">
        <div className="form-section-head"><span>⚡</span> Technical Skills</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {portfolio.skills.map((s, i) => (
            <span key={i} className="tag">{s}<button onClick={() => removeSkill(i)} style={{ background: 'none', border: 'none', color: '#c9a84c', cursor: 'pointer', marginLeft: 4 }}>×</button></span>
          ))}
          {portfolio.skills.length === 0 && <span style={{ color: '#625e58', fontSize: '0.85rem' }}>No skills added yet</span>}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input className="form-input" style={{ flex: 1 }} value={si} onChange={e => setSi(e.target.value)} onKeyDown={e => e.key === 'Enter' && addS()} placeholder="Add a skill (e.g. React, Python, Figma)..." />
          <button onClick={addS} style={{ padding: '0.5rem 1rem', borderRadius: 8, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', color: '#c9a84c', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>+ Add</button>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label className="form-label">Quick Add Popular Skills</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
            {['JavaScript','TypeScript','React','Next.js','Node.js','Python','Figma','AWS','Docker','GraphQL','PostgreSQL','MongoDB','Tailwind CSS','Flutter'].map(s => (
              <button key={s} onClick={() => { if (!portfolio.skills.includes(s)) { addSkill(s); toast.success(`Added: ${s}`) } }}
                style={{ fontSize: '0.78rem', padding: '3px 10px', borderRadius: 6, border: `1px solid ${portfolio.skills.includes(s) ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.1)'}`, background: portfolio.skills.includes(s) ? 'rgba(201,168,76,0.12)' : 'transparent', color: portfolio.skills.includes(s) ? '#c9a84c' : '#625e58', cursor: 'pointer', transition: 'all 0.2s' }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="form-section">
        <div className="form-section-head"><span>🛠</span> Tools & Software</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {portfolio.tools.map((t, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#a78bfa', borderRadius: 7, padding: '4px 10px', fontSize: '0.8rem', fontWeight: 500 }}>
              {t}<button onClick={() => removeTool(i)} style={{ background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer' }}>×</button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input className="form-input" style={{ flex: 1 }} value={ti} onChange={e => setTi(e.target.value)} onKeyDown={e => e.key === 'Enter' && addT()} placeholder="Add a tool (e.g. VS Code, Notion, Framer)..." />
          <button onClick={addT} style={{ padding: '0.5rem 1rem', borderRadius: 8, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#a78bfa', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>+ Add</button>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <button className="btn-ghost btn-sm" onClick={() => setSection('profile')}>← Back</button>
        <button className="btn-primary btn-sm" onClick={() => { setSection('projects'); toast.success('Skills saved!') }}>Save & Continue →</button>
      </div>
    </div>
  )
}
