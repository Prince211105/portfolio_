'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { usePortfolioStore } from '@/store'
import type { AppPage } from '@/types'
interface Props { navigate: (p: AppPage) => void }
const PRESETS = ['UI/UX Design','Frontend Development','Backend Development','Mobile Development','Design Systems','Branding & Identity','SEO Optimization','Content Writing','Data Analysis','Cloud Architecture','Technical Consulting','Code Review']
export default function ServicesSection({ navigate }: Props) {
  const { portfolio, addService, removeService, setSection } = usePortfolioStore()
  const [inp, setInp] = useState('')
  function add() { const v = inp.trim(); if (!v) return; addService(v); setInp(''); toast.success(`Added: ${v}`) }
  return (
    <div>
      <div className="form-section">
        <div className="form-section-head"><span>🛠</span> Services You Offer</div>
        <p style={{ color: '#9b9488', fontSize: '0.875rem', marginBottom: '1.25rem' }}>List services or offerings you provide to clients or employers.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', minHeight: 36 }}>
          {portfolio.services.map((s, i) => (
            <span key={i} className="tag">{s}<button onClick={() => removeService(i)} style={{ background: 'none', border: 'none', color: '#c9a84c', cursor: 'pointer', marginLeft: 4 }}>×</button></span>
          ))}
          {portfolio.services.length === 0 && <span style={{ color: '#625e58', fontSize: '0.85rem' }}>No services added yet</span>}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <input className="form-input" style={{ flex: 1 }} value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder="Add a service..." />
          <button onClick={add} style={{ padding: '0.5rem 1rem', borderRadius: 8, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', color: '#c9a84c', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>+ Add</button>
        </div>
        <label className="form-label">Quick Add</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
          {PRESETS.map(s => (
            <button key={s} onClick={() => { if (!portfolio.services.includes(s)) { addService(s); toast.success(`Added: ${s}`) } }}
              style={{ fontSize: '0.78rem', padding: '3px 10px', borderRadius: 6, border: `1px solid ${portfolio.services.includes(s) ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.1)'}`, background: portfolio.services.includes(s) ? 'rgba(201,168,76,0.12)' : 'transparent', color: portfolio.services.includes(s) ? '#c9a84c' : '#625e58', cursor: 'pointer' }}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <button className="btn-ghost btn-sm" onClick={() => setSection('skills')}>← Back</button>
        <button className="btn-primary btn-sm" onClick={() => { setSection('projects'); toast.success('Services saved!') }}>Save & Continue →</button>
      </div>
    </div>
  )
}
