'use client'
import toast from 'react-hot-toast'
import { usePortfolioStore } from '@/store'
import type { AppPage } from '@/types'
interface Props { navigate: (p: AppPage) => void }

export default function ExperienceSection({ navigate }: Props) {
  const { portfolio, addExperience, updateExperience, removeExperience, setSection } = usePortfolioStore()
  return (
    <div>
      {portfolio.experience.map((e, i) => (
        <div key={e.id} className="form-section">
          <div className="form-section-head">
            <span>💼</span> Experience {i + 1}
            {portfolio.experience.length > 1 && <button className="btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => { removeExperience(e.id); toast.success('Removed') }}>Remove</button>}
          </div>
          <div className="form-grid">
            <div><label className="form-label">Job Title</label><input className="form-input" value={e.title} onChange={ev => updateExperience(e.id, { title: ev.target.value })} placeholder="Senior Developer" /></div>
            <div><label className="form-label">Company</label><input className="form-input" value={e.company} onChange={ev => updateExperience(e.id, { company: ev.target.value })} placeholder="Company Name" /></div>
            <div><label className="form-label">Period</label><input className="form-input" value={e.period} onChange={ev => updateExperience(e.id, { period: ev.target.value })} placeholder="2021 – Present" /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '0.5rem', alignSelf: 'end' }}>
              <div className={`toggle ${e.current ? 'on' : ''}`} onClick={() => updateExperience(e.id, { current: !e.current })} />
              <span style={{ color: '#9b9488', fontSize: '0.875rem' }}>Currently working here</span>
            </div>
            <div style={{ gridColumn: '1/-1' }}><label className="form-label">Description</label><textarea className="form-textarea" value={e.desc} onChange={ev => updateExperience(e.id, { desc: ev.target.value })} placeholder="Describe your responsibilities and achievements..." /></div>
          </div>
        </div>
      ))}
      <button className="btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => { addExperience(); toast.success('Experience added!') }}>+ Add Experience</button>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <button className="btn-ghost btn-sm" onClick={() => setSection('projects')}>← Back</button>
        <button className="btn-primary btn-sm" onClick={() => { setSection('education'); toast.success('Experience saved!') }}>Save & Continue →</button>
      </div>
    </div>
  )
}
