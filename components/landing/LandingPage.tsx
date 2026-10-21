'use client'
import { useState } from 'react'
import type { AppPage } from '@/types'

interface Props { navigate: (p: AppPage) => void }

const FEATURES = [
  { icon: '🤖', t: 'AI-Powered Content', d: 'Real Anthropic Claude AI generates polished headlines, bios, and descriptions tailored to your profession.' },
  { icon: '🎨', t: '6 Unique Templates', d: 'Each template has a completely different design, typography, and colour palette — your portfolio will stand out.' },
  { icon: '⚡', t: 'Build in 5 Minutes', d: 'Fill out a form, use AI prompt, or pick a template — your portfolio is ready almost instantly.' },
  { icon: '📸', t: 'Multi-Image Upload', d: 'Upload multiple project images per project. Image carousel with lightbox. Stored locally.' },
  { icon: '📱', t: 'Fully Responsive', d: 'Preview your portfolio in desktop, tablet, and mobile views. Always pixel-perfect.' },
  { icon: '💻', t: 'Export Source Code', d: 'Download your portfolio as a single HTML file. Host anywhere — GitHub Pages, Vercel, Netlify.' },
]

const STEPS = [
  { n: '1', t: 'Pick a Template', d: 'Choose from 6 unique professionally designed themes.' },
  { n: '2', t: 'Fill Your Details', d: 'Add your name, skills, projects, experience via a simple form.' },
  { n: '3', t: 'Upload Images', d: 'Add project screenshots and profile photo. Stored locally.' },
  { n: '4', t: 'Preview Live', d: 'See your portfolio in real-time. Toggle desktop/tablet/mobile.' },
  { n: '5', t: 'Export & Deploy', d: 'Download HTML and deploy anywhere for free.' },
]

const TESTIMONIALS = [
  { q: 'Built my portfolio in under 10 minutes. The templates are gorgeous and the code is clean.', name: 'Arjun K.', role: 'Full-Stack Developer', c: '#c9a84c' },
  { q: 'As a designer I was sceptical — but PortfolioForge produced something I am genuinely proud of.', name: 'Sofia C.', role: 'UX Designer', c: '#8b5cf6' },
  { q: 'The AI prompt mode is magic. Typed a paragraph and got a complete portfolio.', name: 'Rahul J.', role: 'Product Manager', c: '#0ea5e9' },
]

const FAQ = [
  ['Do I need to know how to code?', 'Not at all. Fill in your details, pick a template, and download the generated HTML. No code required.'],
  ['Where are images stored?', 'Images are stored locally on your server in the public/uploads/ folder. No third-party cloud service needed.'],
  ['Can I customise after export?', 'Yes! The exported HTML is clean, well-commented single-file code you can edit directly.'],
  ['Does the AI really work?', 'Yes, if you add your Anthropic API key. Otherwise the builder works fully with manual input.'],
  ['Is it really free?', 'Yes — no Pro plan, no feature locks. Everything works out of the box.'],
]

export default function LandingPage({ navigate }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div style={{ paddingTop: 66 }}>
      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 2rem 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 55% at 50% -5%,rgba(201,168,76,0.09) 0%,transparent 65%)', pointerEvents: 'none' }} />
        {/* Orbs */}
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(201,168,76,0.07)', filter: 'blur(70px)', top: 0, left: '5%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(139,92,246,0.06)', filter: 'blur(70px)', top: '20%', right: '8%', pointerEvents: 'none' }} />

        <div className="badge" style={{ marginBottom: '2rem', animation: 'fadeDown 0.6s ease both' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9a84c', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          AI-Powered Portfolio Builder
        </div>

        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.03em', maxWidth: 820, marginBottom: '1.5rem' }}>
          Build Your{' '}
          <span className="text-gradient-gold">Dream Portfolio</span>
          {' '}in Minutes
        </h1>

        <p style={{ color: '#9b9488', fontSize: '1.1rem', maxWidth: 560, lineHeight: 1.75, marginBottom: '2.5rem' }}>
          Pick a template, fill your details, upload project images, and download your portfolio — no coding required.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '4rem' }}>
          <button className="btn-primary btn-lg" onClick={() => navigate('templates')}>Choose a Template →</button>
          <button className="btn-outline btn-lg" onClick={() => navigate('aimode')}>✨ Try AI Mode</button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '3.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[['6','Unique Templates'],['5 min','Avg Build Time'],['0','Code Required'],['100%','Free to Use']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', fontWeight: 700, color: '#e2c06a', lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: '0.78rem', color: '#625e58', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', color: '#625e58', fontSize: '0.75rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
          <span>Scroll to explore</span>
          <span style={{ animation: 'bounce 2s infinite' }}>▾</span>
        </div>
      </section>

      {/* APP MOCKUP */}
      <section style={{ padding: '0 2rem 5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', background: '#13131e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 8px 48px rgba(0,0,0,0.6)' }}>
          <div style={{ background: '#191926', padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
            </div>
            <div style={{ background: '#1f1f30', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, padding: '0.35rem 1rem', fontSize: '0.8rem', color: '#625e58', flex: 1, maxWidth: 380 }}>portfolioforge.app/builder</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: 320 }}>
            <div style={{ background: '#191926', borderRight: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#625e58', fontWeight: 700, marginBottom: '0.75rem' }}>Builder</div>
              {['👤 Profile Info','⚡ Skills','🚀 Projects','💼 Experience','🎨 Design','📸 Photos','✨ AI Suggestions','👁 Preview','📦 Export'].map((item, i) => (
                <div key={i} style={{ padding: '0.55rem 0.75rem', borderRadius: 8, fontSize: '0.8rem', marginBottom: 2, color: i === 0 ? '#c9a84c' : '#9b9488', background: i === 0 ? 'rgba(201,168,76,0.1)' : 'transparent', cursor: 'default' }}>{item}</div>
              ))}
            </div>
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ background: '#191926', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '1.25rem' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#c9a84c,#8b5cf6)', marginBottom: '0.875rem' }} />
                <div style={{ height: 9, borderRadius: 5, background: 'linear-gradient(90deg,#c9a84c,#e2c06a)', width: '65%', marginBottom: 8 }} />
                <div style={{ height: 9, borderRadius: 5, background: 'rgba(255,255,255,0.07)', width: '80%', marginBottom: 6 }} />
                <div style={{ height: 9, borderRadius: 5, background: 'rgba(255,255,255,0.07)', width: '55%' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {['rgba(201,168,76,0.15)','rgba(139,92,246,0.1)'].map((bg, i) => (
                  <div key={i} style={{ background: '#191926', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '1rem' }}>
                    <div style={{ height: 8, borderRadius: 4, background: bg, width: '60%', marginBottom: 6 }} />
                    <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.07)', width: '80%', marginBottom: 5 }} />
                    <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.07)', width: '50%' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* FEATURES */}
      <section style={{ padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-tag">Features</div>
          <h2 className="section-title">Everything You Need</h2>
          <p style={{ color: '#9b9488', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 500, marginBottom: '3rem' }}>Powerful tools in a simple interface. Build once, impress everywhere.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.5rem' }}>
            {FEATURES.map(f => (
              <div key={f.t} className="card card-hover" style={{ padding: '2.25rem 2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: 50, height: 50, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1.25rem' }}>{f.icon}</div>
                <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.5rem' }}>{f.t}</div>
                <p style={{ color: '#9b9488', fontSize: '0.9rem', lineHeight: 1.7 }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* HOW IT WORKS */}
      <section style={{ padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-tag">How It Works</div>
          <h2 className="section-title">Ready in 5 Simple Steps</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1.25rem', marginTop: '3rem' }}>
            {STEPS.map(s => (
              <div key={s.n} className="card" style={{ padding: '2rem 1.75rem', textAlign: 'center', transition: 'all 0.3s', cursor: 'default' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.4)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#c9a84c,#a87830)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.05rem', color: '#08080d', margin: '0 auto 1.25rem', boxShadow: '0 4px 16px rgba(201,168,76,0.35)' }}>{s.n}</div>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.975rem' }}>{s.t}</div>
                <p style={{ color: '#9b9488', fontSize: '0.85rem', lineHeight: 1.65 }}>{s.d}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button className="btn-primary btn-lg" onClick={() => navigate('templates')}>Start Creating →</button>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* TESTIMONIALS */}
      <section style={{ padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-tag">Testimonials</div>
          <h2 className="section-title">Loved by Creators</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.5rem', marginTop: '3rem' }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card" style={{ padding: '2rem' }}>
                <div style={{ color: '#c9a84c', fontSize: '1rem', letterSpacing: '0.15em', marginBottom: '1rem' }}>★★★★★</div>
                <p style={{ color: '#9b9488', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.75, marginBottom: '1.5rem' }}>"{t.q}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: t.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: '#08080d' }}>{t.name.split(' ').map(n => n[0]).join('')}</div>
                  <div><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</div><div style={{ color: '#625e58', fontSize: '0.8rem' }}>{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* FAQ */}
      <section style={{ padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="section-tag">FAQ</div>
          <h2 className="section-title">Frequently Asked</h2>
          <div style={{ marginTop: '2.5rem' }}>
            {FAQ.map(([q, a], i) => (
              <div key={i} className="faq-item">
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {q}
                  <span className="faq-arrow" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none' }}>▾</span>
                </button>
                <div className={`faq-body ${openFaq === i ? 'open' : ''}`}>
                  <div className="faq-body-inner">{a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: 'linear-gradient(135deg,rgba(201,168,76,0.07),rgba(139,92,246,0.05))', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '5rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 700, marginBottom: '1rem' }}>Your portfolio is waiting.</h2>
        <p style={{ color: '#9b9488', fontSize: '1.05rem', marginBottom: '2.5rem', maxWidth: 480, margin: '0 auto 2.5rem' }}>Pick a template and build your portfolio in 5 minutes.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary btn-lg" onClick={() => navigate('templates')}>Choose a Template →</button>
          <button className="btn-outline btn-lg" onClick={() => navigate('aimode')}>✨ Use AI Mode</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0e0e16', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', fontWeight: 700, background: 'linear-gradient(135deg,#c9a84c,#f0d898)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.75rem' }}>PortfolioForge</div>
        <p style={{ color: '#625e58', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Build beautiful portfolios with AI. No coding required.</p>
        <p style={{ color: '#625e58', fontSize: '0.8rem' }}>© {new Date().getFullYear()} PortfolioForge. Built with ♥ for creators.</p>
      </footer>

      <style>{`
        @keyframes fadeDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  )
}
