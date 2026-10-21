'use client'
import toast from 'react-hot-toast'
import { usePortfolioStore } from '@/store'
import type { AppPage } from '@/types'
interface Props { navigate: (p: AppPage) => void }
export default function EducationSection({ navigate }: Props) {
  const { portfolio, addEducation, updateEducation, removeEducation, setSection } = usePortfolioStore()
  return (
    <div>
      {portfolio.education.map((e, i) => (
        <div key={e.id} className="form-section">
          <div className="form-section-head">
            <span>🎓</span> Education {i + 1}
            {portfolio.education.length > 1 && <button className="btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => { removeEducation(e.id); toast.success('Removed') }}>Remove</button>}
          </div>
          <div className="form-grid">
            <div><label className="form-label">Degree / Qualification</label><input className="form-input" value={e.degree} onChange={ev => updateEducation(e.id, { degree: ev.target.value })} placeholder="B.Sc. Computer Science" /></div>
            <div><label className="form-label">School / University</label><input className="form-input" value={e.school} onChange={ev => updateEducation(e.id, { school: ev.target.value })} placeholder="University Name" /></div>
            <div><label className="form-label">Year</label><input className="form-input" value={e.year} onChange={ev => updateEducation(e.id, { year: ev.target.value })} placeholder="2020" /></div>
            <div><label className="form-label">Notes (optional)</label><input className="form-input" value={e.desc} onChange={ev => updateEducation(e.id, { desc: ev.target.value })} placeholder="Focus area, GPA, honours..." /></div>
          </div>
        </div>
      ))}
      <button className="btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => { addEducation(); toast.success('Education added!') }}>+ Add Education</button>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <button className="btn-ghost btn-sm" onClick={() => setSection('experience')}>← Back</button>
        <button className="btn-primary btn-sm" onClick={() => { setSection('testimonials'); toast.success('Education saved!') }}>Save & Continue →</button>
      </div>
    </div>
  )
}
