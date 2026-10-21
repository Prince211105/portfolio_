'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { usePortfolioStore, TEMPLATES } from '@/store'
import type { AppPage } from '@/types'

interface Props { navigate: (p: AppPage) => void }

const TEMPLATE_META = [
  {
    key: 'noir-executive',
    name: 'Noir Executive',
    desc: 'Premium dark luxury look for founders, consultants, and high-level professionals.',
    tags: ['Executive', 'Luxury', 'Premium'],
    accent: '#d4af37',
    preview: {
      bg: 'linear-gradient(135deg, #090b10 0%, #101923 100%)',
      navBg: 'rgba(9,11,16,0.96)',
      heroBg: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(212,175,55,0.16), transparent)',
      accentColor: '#d4af37',
      fontFamily: "'Space Grotesk', sans-serif",
      name: 'Aarav Mehta',
      role: 'Founder & Strategy Lead',
      headline: 'Turning bold ideas into momentum.',
      skills: ['Strategy','Leadership','Growth','Analytics'],
      projectBg: 'linear-gradient(135deg,#0f1a2a,#1d2c3c)',
    }
  },
  {
    key: 'aurora-studio',
    name: 'Aurora Studio',
    desc: 'Vibrant creative design system for brands, art directors, and digital studios.',
    tags: ['Creative', 'Bold', 'Brand'],
    accent: '#8b5cf6',
    preview: {
      bg: 'linear-gradient(135deg, #0d0621 0%, #1b0d32 100%)',
      navBg: 'rgba(13,6,33,0.96)',
      heroBg: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(139,92,246,0.22), transparent)',
      accentColor: '#8b5cf6',
      fontFamily: "'Syne', sans-serif",
      name: 'Maya Patel',
      role: 'Brand & Visual Designer',
      headline: 'Designing memorable digital stories.',
      skills: ['Branding','UX','Systems','Art Direction'],
      projectBg: 'linear-gradient(135deg,#1b0d32,#2d1f4a)',
    }
  },
  {
    key: 'ivory-editorial',
    name: 'Ivory Editorial',
    desc: 'Minimal luxury editorial feel built for writers, consultants, and thought leaders.',
    tags: ['Writer', 'Minimal', 'Luxury'],
    accent: '#b8860b',
    preview: {
      bg: '#f8fafc',
      navBg: 'rgba(248,250,252,0.95)',
      heroBg: 'linear-gradient(180deg,#fffef6 0%,#f8fafc 100%)',
      accentColor: '#b8860b',
      fontFamily: "'Playfair Display', serif",
      name: 'Jordan Mills',
      role: 'Writer & Strategist',
      headline: 'Words that build trust and momentum.',
      skills: ['SEO','Brand Voice','Copywriting','Editorial'],
      projectBg: '#f1f5f9',
      lightMode: true,
    }
  },
  {
    key: 'solar-atelier',
    name: 'Solar Atelier',
    desc: 'Warm artistic layout made for photographers, creators, and visual storytellers.',
    tags: ['Photographer', 'Art', 'Editorial'],
    accent: '#f43f5e',
    preview: {
      bg: 'linear-gradient(135deg, #11070a 0%, #2a0f1a 100%)',
      navBg: 'rgba(17,7,10,0.96)',
      heroBg: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(244,63,94,0.18), transparent)',
      accentColor: '#f43f5e',
      fontFamily: "'Syne', sans-serif",
      name: 'Sam Rivera',
      role: 'Photographer & Artist',
      headline: 'Capturing feeling through light.',
      skills: ['Portrait','Editorial','Commercial','Retouching'],
      projectBg: 'linear-gradient(135deg,#2a0f1a,#40172b)',
    }
  },
  {
    key: 'neon-dev',
    name: 'Neon Systems',
    desc: 'Sharp engineering aesthetic crafted for devs, product builders, and technical founders.',
    tags: ['Developer', 'Tech', 'System'],
    accent: '#14b8a6',
    preview: {
      bg: 'linear-gradient(135deg, #07151a 0%, #0d1f2f 100%)',
      navBg: 'rgba(7,21,26,0.96)',
      heroBg: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(20,184,166,0.18), transparent)',
      accentColor: '#14b8a6',
      fontFamily: "'Space Grotesk', sans-serif",
      name: 'Alex Chen',
      role: 'Full-Stack Engineer',
      headline: 'Building software that lasts.',
      skills: ['React','TypeScript','Cloud','Architecture'],
      projectBg: 'linear-gradient(135deg,#0d1f2f,#102d3d)',
    }
  },
  {
    key: 'luxe-freelance',
    name: 'Luxe Freelance',
    desc: 'Warm premium identity template perfect for freelancers, agencies, and boutique brands.',
    tags: ['Freelance', 'Warm', 'Premium'],
    accent: '#f97316',
    preview: {
      bg: 'linear-gradient(135deg, #120d08 0%, #1f130b 100%)',
      navBg: 'rgba(18,13,8,0.96)',
      heroBg: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(249,115,22,0.15), transparent)',
      accentColor: '#f97316',
      fontFamily: "'Playfair Display', serif",
      name: 'Dana Kim',
      role: 'Brand Designer',
      headline: 'Identity work with presence and heart.',
      skills: ['Branding','Packaging','Illustration','Typography'],
      projectBg: 'linear-gradient(135deg,#1f130b,#312013)',
    }
  },
]

function TemplatePreviewCard({ tpl, selected, onSelect }: { tpl: typeof TEMPLATE_META[0]; selected: boolean; onSelect: () => void }) {
  const p = tpl.preview
  const isLight = p.lightMode
  const textColor = isLight ? '#1e293b' : '#edeae4'
  const text2 = isLight ? '#64748b' : '#9b9488'
  const borderColor = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.07)'

  return (
    <div
      className={`template-card ${selected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      {/* Browser chrome */}
      <div style={{ background: '#1a1a26', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbd2e' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840' }} />
        <div style={{ flex: 1, height: 16, background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginLeft: 8 }} />
      </div>

      {/* Mini portfolio preview */}
      <div className="template-preview" style={{ background: p.bg }}>
        {/* Mini nav */}
        <div style={{ background: p.navBg, padding: '6px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, backdropFilter: 'blur(10px)' }}>
          <span style={{ fontFamily: p.fontFamily, fontWeight: 700, fontSize: 10, color: p.accentColor }}>{p.name.split(' ')[0]}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Work','About','Contact'].map(l => <span key={l} style={{ fontSize: 8, color: text2 }}>{l}</span>)}
          </div>
        </div>

        {/* Mini hero */}
        <div style={{ background: p.heroBg, padding: '16px 14px 14px', textAlign: 'center' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg,${p.accentColor},${p.accentColor}88)`, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: isLight ? '#fff' : '#08080d', fontFamily: p.fontFamily }}>
            {p.name.split(' ').map((n: string) => n[0]).join('').slice(0,2)}
          </div>
          <div style={{ fontFamily: p.fontFamily, fontSize: 11, fontWeight: 700, color: p.accentColor, marginBottom: 2 }}>{p.name}</div>
          <div style={{ fontSize: 8, color: text2, marginBottom: 4 }}>{p.role}</div>
          <div style={{ fontSize: 7.5, color: text2, fontStyle: 'italic', marginBottom: 8 }}>"{p.headline}"</div>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
            {p.skills.slice(0,3).map((s: string) => (
              <span key={s} style={{ background: `${p.accentColor}20`, border: `1px solid ${p.accentColor}40`, color: p.accentColor, borderRadius: 100, padding: '1px 5px', fontSize: 6, fontWeight: 600 }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Mini project cards */}
        <div style={{ padding: '8px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
          {[['🎨','Project One'],['🚀','Project Two']].map(([icon, name]) => (
            <div key={name} style={{ background: p.projectBg, border: `1px solid ${borderColor}`, borderRadius: 6, padding: '6px 7px' }}>
              <div style={{ fontSize: 12, marginBottom: 3 }}>{icon}</div>
              <div style={{ fontSize: 7.5, fontWeight: 600, color: textColor, marginBottom: 2 }}>{name}</div>
              <div style={{ fontSize: 6.5, color: text2 }}>React · TypeScript</div>
            </div>
          ))}
        </div>

        {/* Selected overlay */}
        {selected && (
          <div style={{ position: 'absolute', inset: 0, background: `${p.accentColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ background: p.accentColor, color: '#08080d', borderRadius: 100, padding: '4px 12px', fontSize: 10, fontWeight: 800 }}>✓ Selected</div>
          </div>
        )}
      </div>

      {/* Template info */}
      <div className="template-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#edeae4' }}>{tpl.name}</span>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: tpl.accent }} />
        </div>
        <p style={{ color: '#625e58', fontSize: '0.75rem', lineHeight: 1.4, marginBottom: 8 }}>{tpl.desc}</p>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {tpl.tags.map(t => (
            <span key={t} style={{ background: `${tpl.accent}15`, border: `1px solid ${tpl.accent}30`, color: tpl.accent, borderRadius: 100, padding: '2px 8px', fontSize: '0.68rem', fontWeight: 600 }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function TemplateSelectPage({ navigate }: Props) {
  const { selectedTemplate, loadTemplate, resetPortfolio } = usePortfolioStore()
  const [chosen, setChosen] = useState(selectedTemplate || '')

  function handleSelect(key: string) {
    setChosen(key)
  }

  function handleUseTemplate() {
    if (!chosen) { toast.error('Please select a template first'); return }
    loadTemplate(chosen)
    toast.success('Template loaded! Fill in your details now.')
    navigate('builder')
  }

  function handleStartBlank() {
    resetPortfolio()
    navigate('builder')
  }

  return (
    <div className="pt-[66px] min-h-screen">
      {/* Header */}
      <div style={{ background: 'linear-gradient(180deg,rgba(201,168,76,0.06) 0%,transparent 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '3rem 2rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div className="badge mb-4">Step 1 of 5 — Choose Your Style</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.75rem)', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Choose Your <span className="text-gradient-gold">Portfolio Style</span>
          </h1>
          <p style={{ color: '#9b9488', fontSize: '1.05rem', maxWidth: 520, margin: '0 auto' }}>
            Each template has a unique design, typography, and colour palette. Pick one that matches your personality and profession.
          </p>
        </div>
      </div>

      {/* Template Grid */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {TEMPLATE_META.map(tpl => (
            <TemplatePreviewCard
              key={tpl.key}
              tpl={tpl}
              selected={chosen === tpl.key}
              onSelect={() => handleSelect(tpl.key)}
            />
          ))}
        </div>

        {/* Action bar */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18 }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            {chosen ? (
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>
                  Selected: <span style={{ color: '#c9a84c' }}>{TEMPLATE_META.find(t => t.key === chosen)?.name}</span>
                </div>
                <div style={{ color: '#625e58', fontSize: '0.85rem' }}>Template will be pre-filled with sample content — replace with your real info</div>
              </div>
            ) : (
              <div style={{ color: '#625e58' }}>← Select a template to continue</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className="btn-ghost btn-sm" onClick={handleStartBlank}>Start from Blank</button>
            <button className="btn-ghost btn-sm" onClick={() => navigate('aimode')}>✨ Use AI Mode</button>
            <button
              className="btn-primary"
              onClick={handleUseTemplate}
              style={{ opacity: chosen ? 1 : 0.5 }}
            >
              Use This Template →
            </button>
          </div>
        </div>

        {/* Back */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button className="btn-ghost btn-sm" onClick={() => navigate('landing')}>← Back to Home</button>
        </div>
      </div>
    </div>
  )
}
