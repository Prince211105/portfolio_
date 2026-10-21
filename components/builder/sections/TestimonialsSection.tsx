'use client'
import toast from 'react-hot-toast'
import { usePortfolioStore } from '@/store'
import type { AppPage } from '@/types'
interface Props { navigate: (p: AppPage) => void }
const COLORS = ['#c9a84c','#8b5cf6','#10b981','#f43f5e','#0ea5e9','#f97316']
export default function TestimonialsSection({ navigate }: Props) {
  const { portfolio, addTestimonial, updateTestimonial, removeTestimonial, setSection } = usePortfolioStore()
  return (
    <div>
      <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#9b9488' }}>
        💡 Adding 2–3 testimonials increases portfolio trust by up to 60%. Copy quotes from LinkedIn recommendations.
      </div>
      {portfolio.testimonials.map((t, i) => (
        <div key={t.id} className="form-section">
          <div className="form-section-head">
            <span>💬</span> Testimonial {i + 1}
            {portfolio.testimonials.length > 1 && <button className="btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => { removeTestimonial(t.id); toast.success('Removed') }}>Remove</button>}
          </div>
          <div className="form-grid">
            <div style={{ gridColumn: '1/-1' }}><label className="form-label">Quote</label><textarea className="form-textarea" style={{ minHeight: 90 }} value={t.text} onChange={e => updateTestimonial(t.id, { text: e.target.value })} placeholder="What they said about working with you..." /></div>
            <div><label className="form-label">Name</label><input className="form-input" value={t.name} onChange={e => updateTestimonial(t.id, { name: e.target.value })} placeholder="Client Name" /></div>
            <div><label className="form-label">Role / Company</label><input className="form-input" value={t.role} onChange={e => updateTestimonial(t.id, { role: e.target.value })} placeholder="CEO, Company Name" /></div>
            <div><label className="form-label">Initials (2 chars)</label><input className="form-input" value={t.initials} maxLength={2} onChange={e => updateTestimonial(t.id, { initials: e.target.value.toUpperCase() })} placeholder="JL" /></div>
            <div><label className="form-label">Avatar Color</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {COLORS.map(c => <div key={c} onClick={() => updateTestimonial(t.id, { color: c })} style={{ width: 36, height: 36, borderRadius: 8, background: c, cursor: 'pointer', border: `2px solid ${t.color === c ? 'white' : 'transparent'}`, transform: t.color === c ? 'scale(1.1)' : 'none', transition: 'all 0.2s' }} />)}
              </div>
            </div>
          </div>
        </div>
      ))}
      <button className="btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => { addTestimonial(); toast.success('Testimonial added!') }}>+ Add Testimonial</button>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <button className="btn-ghost btn-sm" onClick={() => setSection('education')}>← Back</button>
        <button className="btn-primary btn-sm" onClick={() => { setSection('achievements'); toast.success('Testimonials saved!') }}>Save & Continue →</button>
      </div>
    </div>
  )
}
