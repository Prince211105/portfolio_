'use client'
import toast from 'react-hot-toast'
import { usePortfolioStore } from '@/store'
import type { AppPage, SectionVisibility } from '@/types'
interface Props { navigate: (p: AppPage) => void }
const SECTIONS: { key: keyof SectionVisibility; label: string; desc: string }[] = [
  { key: 'hero',         label: 'Hero Section',   desc: 'Name, role, headline and CTA buttons' },
  { key: 'about',        label: 'About Me',        desc: 'Bio, achievements, certifications' },
  { key: 'skills',       label: 'Skills & Tools',  desc: 'Technical skills and software' },
  { key: 'projects',     label: 'Projects',        desc: 'Featured work with images and links' },
  { key: 'experience',   label: 'Experience',      desc: 'Work history and job timeline' },
  { key: 'education',    label: 'Education',       desc: 'Degrees and schools' },
  { key: 'services',     label: 'Services',        desc: 'What you offer clients' },
  { key: 'testimonials', label: 'Testimonials',    desc: 'Client quotes and reviews' },
  { key: 'achievements', label: 'Achievements',    desc: 'Awards and milestones' },
  { key: 'contact',      label: 'Contact Form',    desc: 'Contact form and social links' },
]
export default function SectionsPanel({ navigate }: Props) {
  const { portfolio, updateSections, setSection } = usePortfolioStore()
  function toggle(key: keyof SectionVisibility) {
    updateSections({ [key]: !portfolio.sections[key] })
    toast.success(`${key} ${!portfolio.sections[key] ? 'enabled' : 'disabled'}`)
  }
  return (
    <div>
      <div className="form-section">
        <div className="form-section-head"><span>📋</span> Section Visibility</div>
        <p style={{ color: '#9b9488', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Toggle which sections appear in your portfolio. Disabled sections are excluded from the export.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {SECTIONS.map(s => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.25)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.label}</div>
                <div style={{ color: '#625e58', fontSize: '0.8rem', marginTop: 2 }}>{s.desc}</div>
              </div>
              <div className={`toggle ${portfolio.sections[s.key] ? 'on' : ''}`} onClick={() => toggle(s.key)} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <button className="btn-ghost btn-sm" onClick={() => setSection('design')}>← Back</button>
        <button className="btn-primary btn-sm" onClick={() => { navigate('preview'); toast.success('Layout saved!') }}>Preview Portfolio →</button>
      </div>
    </div>
  )
}
