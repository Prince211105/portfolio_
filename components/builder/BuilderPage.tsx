'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { usePortfolioStore } from '@/store'
import type { AppPage, BuilderSection } from '@/types'
import ProfileSection    from './sections/ProfileSection'
import SkillsSection     from './sections/SkillsSection'
import ServicesSection   from './sections/ServicesSection'
import ProjectsSection   from './sections/ProjectsSection'
import ExperienceSection from './sections/ExperienceSection'
import EducationSection  from './sections/EducationSection'
import TestimonialsSection from './sections/TestimonialsSection'
import AchievementsSection from './sections/AchievementsSection'
import DesignSection     from './sections/DesignSection'
import SectionsPanel     from './sections/SectionsPanel'

interface Props { navigate: (p: AppPage) => void }

const NAV: { section: BuilderSection; icon: string; label: string; group: string }[] = [
  { section:'profile',      icon:'👤', label:'Personal Info',   group:'Profile'  },
  { section:'skills',       icon:'⚡', label:'Skills & Tools',  group:'Profile'  },
  { section:'services',     icon:'🛠', label:'Services',        group:'Profile'  },
  { section:'projects',     icon:'🚀', label:'Projects',        group:'Work'     },
  { section:'experience',   icon:'💼', label:'Experience',      group:'Work'     },
  { section:'education',    icon:'🎓', label:'Education',       group:'Work'     },
  { section:'testimonials', icon:'💬', label:'Testimonials',    group:'Work'     },
  { section:'achievements', icon:'🏆', label:'Achievements',    group:'Work'     },
  { section:'design',       icon:'🎨', label:'Design & Theme',  group:'Output'   },
  { section:'sections',     icon:'📋', label:'Section Layout',  group:'Output'   },
]

const STEPS = ['Profile','Skills','Projects','Experience','Media','Design','Preview']

export default function BuilderPage({ navigate }: Props) {
  const { currentSection, setSection, saveToLocal, portfolio } = usePortfolioStore()
  const [step, setStep] = useState(1)
  const groups = [...new Set(NAV.map(n => n.group))]

  const views: Partial<Record<BuilderSection, React.ReactNode>> = {
    profile:      <ProfileSection      navigate={navigate} />,
    skills:       <SkillsSection       navigate={navigate} />,
    services:     <ServicesSection     navigate={navigate} />,
    projects:     <ProjectsSection     navigate={navigate} />,
    experience:   <ExperienceSection   navigate={navigate} />,
    education:    <EducationSection    navigate={navigate} />,
    testimonials: <TestimonialsSection navigate={navigate} />,
    achievements: <AchievementsSection navigate={navigate} />,
    design:       <DesignSection       navigate={navigate} />,
    sections:     <SectionsPanel       navigate={navigate} />,
  }

  return (
    <div style={{ paddingTop: 66 }}>
      {/* Progress bar */}
      <div style={{ background: '#0e0e16', borderBottom: '1px solid rgba(255,255,255,0.07)', height: 54, display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: 0, overflowX: 'auto' }}>
        {STEPS.map((label, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            <div onClick={() => setStep(i)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem', height: 54, cursor: 'pointer', color: i === step ? '#c9a84c' : i < step ? '#9b9488' : '#625e58', whiteSpace: 'nowrap', fontSize: '0.83rem', fontWeight: 500 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${i === step ? '#c9a84c' : i < step ? '#9b9488' : '#625e58'}`, background: i === step ? '#c9a84c' : i < step ? '#625e58' : 'transparent', color: i === step ? '#08080d' : i < step ? '#08080d' : 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="hidden-xs">{label}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 'calc(100vh - 120px)' }}>
        {/* Sidebar */}
        <aside style={{ background: '#0e0e16', borderRight: '1px solid rgba(255,255,255,0.07)', padding: '1.5rem 1.25rem', position: 'sticky', top: 120, height: 'calc(100vh - 120px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {groups.map(group => (
            <div key={group}>
              <div style={{ fontSize: '0.66rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#625e58', padding: '0.5rem 0.375rem', marginTop: '0.5rem' }}>{group}</div>
              {NAV.filter(n => n.group === group).map(item => (
                <div key={item.section} className={`sb-item ${currentSection === item.section ? 'active' : ''}`} onClick={() => setSection(item.section)}>
                  <span style={{ fontSize: '1.05rem', width: 20, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          ))}
          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="sb-item" onClick={() => navigate('aimode')}><span style={{ fontSize: '1.05rem', width: 20, textAlign: 'center' }}>✨</span>AI Mode</div>
            <div className="sb-item" onClick={() => navigate('preview')}><span style={{ fontSize: '1.05rem', width: 20, textAlign: 'center' }}>👁</span>Live Preview</div>
            <div className="sb-item" onClick={() => navigate('export')}><span style={{ fontSize: '1.05rem', width: 20, textAlign: 'center' }}>📦</span>Export Code</div>
            <button onClick={() => navigate('preview')} style={{ width: '100%', marginTop: '0.875rem', padding: '0.75rem', borderRadius: 10, fontWeight: 700, fontSize: '0.875rem', color: '#08080d', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#c9a84c,#a87830)', transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,76,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
              👁 Preview Portfolio →
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ padding: '2.25rem 2.5rem', overflowY: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.65rem', fontWeight: 700 }}>Portfolio Builder</h1>
              <p style={{ color: '#625e58', fontSize: '0.82rem', marginTop: 4 }}>
                {portfolio.name ? `Building: ${portfolio.name}` : 'Fill in your details below'} · Auto-saved
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button className="btn-ghost btn-sm" onClick={() => navigate('templates')}>🎨 Templates</button>
              <button className="btn-ghost btn-sm" onClick={() => { saveToLocal(); toast.success('Draft saved! 💾') }}>💾 Save</button>
              <button className="btn-purple btn-sm" onClick={() => navigate('aimode')}>✨ AI Mode</button>
              <button className="btn-primary btn-sm" onClick={() => navigate('preview')}>Preview →</button>
            </div>
          </div>
          {views[currentSection] || <div style={{ color: '#625e58', padding: '2rem' }}>Select a section from the sidebar</div>}
        </main>
      </div>
      <style>{`.hidden-xs{} @media(max-width:480px){.hidden-xs{display:none!important}}`}</style>
    </div>
  )
}
