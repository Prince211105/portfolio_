'use client'
import toast from 'react-hot-toast'
import { usePortfolioStore } from '@/store'
import type { AppPage } from '@/types'
interface Props { navigate: (p: AppPage) => void }
const ACCENTS = [['gold','#c9a84c'],['purple','#8b5cf6'],['teal','#0d9488'],['rose','#f43f5e'],['sky','#0ea5e9'],['orange','#f97316'],['green','#22c55e']]
const THEMES = [['dark-luxury','🌙 Dark Luxury'],['light-minimal','☀ Light Minimal'],['bold-creative','💜 Bold Creative'],['tech-clean','🔵 Tech Clean'],['warm-editorial','🌿 Warm Editorial']]
const FONTS = [['playfair','Playfair Display + DM Sans'],['space','Space Grotesk + DM Sans'],['syne','Syne + DM Sans'],['dm','DM Sans (All)']]
const LAYOUTS = [['centered','Centered Clean'],['left-aligned','Left-Aligned Pro'],['magazine','Magazine Editorial'],['asymmetric','Creative Asymmetric']]
const TONES = [['professional','Professional & Confident'],['friendly','Friendly & Approachable'],['creative','Creative & Bold'],['technical','Technical & Precise']]
const ANIMS = [['subtle','Subtle (Recommended)'],['none','None'],['expressive','Expressive']]

export default function DesignSection({ navigate }: Props) {
  const { portfolio, updateTheme, setSection } = usePortfolioStore()
  const { theme } = portfolio

  function randomize() {
    const styles = ['dark-luxury','bold-creative','tech-clean','warm-editorial'] as const
    const accents = ['gold','purple','teal','rose','sky','orange'] as const
    updateTheme({ style: styles[Math.floor(Math.random()*styles.length)], accent: accents[Math.floor(Math.random()*accents.length)] })
    toast.success('Theme randomised! ✨')
  }

  return (
    <div>
      <div className="form-section">
        <div className="form-section-head"><span>🎨</span> Theme & Style</div>
        <div className="form-grid">
          <div><label className="form-label">Theme</label>
            <select className="form-select" value={theme.style} onChange={e => updateTheme({ style: e.target.value as any })}>
              {THEMES.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div><label className="form-label">Font Pairing</label>
            <select className="form-select" value={theme.font} onChange={e => updateTheme({ font: e.target.value as any })}>
              {FONTS.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div><label className="form-label">Layout</label>
            <select className="form-select" value={theme.layout} onChange={e => updateTheme({ layout: e.target.value as any })}>
              {LAYOUTS.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div><label className="form-label">Writing Tone</label>
            <select className="form-select" value={theme.tone} onChange={e => updateTheme({ tone: e.target.value as any })}>
              {TONES.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div><label className="form-label">Animations</label>
            <select className="form-select" value={theme.animation} onChange={e => updateTheme({ animation: e.target.value as any })}>
              {ANIMS.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginTop: '1.25rem' }}>
          <label className="form-label">Accent Color</label>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.625rem', flexWrap: 'wrap' }}>
            {ACCENTS.map(([key, color]) => (
              <div key={key} onClick={() => { updateTheme({ accent: key as any }); toast.success(`Accent: ${key}`) }}
                className={`color-swatch ${theme.accent === key ? 'selected' : ''}`} style={{ background: color }} title={key} />
            ))}
          </div>
        </div>
        <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#191926', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize: '0.7rem', color: '#625e58', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Current Theme Preview</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[theme.style.replace('-',' '), ACCENTS.find(([k])=>k===theme.accent)?.[1] || '', theme.animation+' animations', theme.tone+' tone'].map(chip => (
              <span key={chip} className="chip chip-gold">{chip}</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button className="btn-ghost btn-sm" onClick={() => setSection('achievements')}>← Back</button>
        <button className="btn-ghost btn-sm" onClick={randomize}>🎲 Randomise</button>
        <button className="btn-ghost btn-sm" onClick={() => setSection('sections')}>Manage Sections</button>
        <button className="btn-primary btn-sm" onClick={() => { navigate('preview'); toast.success('Generating preview...') }}>Preview Portfolio →</button>
      </div>
    </div>
  )
}
