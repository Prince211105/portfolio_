'use client'
import toast from 'react-hot-toast'
import { usePortfolioStore } from '@/store'
import type { AppPage } from '@/types'
interface Props { navigate: (p: AppPage) => void }
export default function AchievementsSection({ navigate }: Props) {
  const { portfolio, updateField, setSection } = usePortfolioStore()
  return (
    <div>
      <div className="form-section">
        <div className="form-section-head"><span>🏆</span> Achievements & Certifications</div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Key Achievements <span style={{ color: '#625e58', fontWeight: 400, textTransform: 'none' }}>(one per line)</span></label>
          <textarea className="form-textarea" style={{ minHeight: 120 }} value={portfolio.achievements.join('\n')} onChange={e => updateField('achievements', e.target.value.split('\n').filter(Boolean))} placeholder={"Speaker at React Conf 2023\nOpen source contributor (2k+ GitHub stars)\nFeature in \"30 Under 30 Designers\""} />
          <p style={{ color: '#625e58', fontSize: '0.78rem', marginTop: '0.5rem' }}>Each line = one achievement. Shown with ★ icon in your portfolio.</p>
        </div>
        <div>
          <label className="form-label">Certifications <span style={{ color: '#625e58', fontWeight: 400, textTransform: 'none' }}>(one per line)</span></label>
          <textarea className="form-textarea" style={{ minHeight: 90 }} value={portfolio.certifications.join('\n')} onChange={e => updateField('certifications', e.target.value.split('\n').filter(Boolean))} placeholder={"Google UX Design Certificate\nAWS Certified Developer"} />
          <p style={{ color: '#625e58', fontSize: '0.78rem', marginTop: '0.5rem' }}>Shown as badge chips in your About section.</p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <button className="btn-ghost btn-sm" onClick={() => setSection('testimonials')}>← Back</button>
        <button className="btn-primary btn-sm" onClick={() => { setSection('design'); toast.success('Achievements saved!') }}>Save & Continue →</button>
      </div>
    </div>
  )
}
