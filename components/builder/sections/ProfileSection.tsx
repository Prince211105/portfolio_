'use client'
import toast from 'react-hot-toast'
import { usePortfolioStore } from '@/store'
import type { AppPage } from '@/types'
interface Props { navigate: (p: AppPage) => void }
export default function ProfileSection({ navigate }: Props) {
  const { portfolio, updateField, setSection } = usePortfolioStore()
  const p = portfolio

  function handleProfilePhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      updateField('profilePhoto', result)
      updateField('showProfilePhoto', true)
      toast.success('Profile photo added!')
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  return (
    <div>
      <div className="form-section">
        <div className="form-section-head"><span>👤</span> Personal Information</div>
        <div className="form-grid">
          <div><label className="form-label">Full Name *</label><input className="form-input" value={p.name} onChange={e => updateField('name', e.target.value)} placeholder="Your full name" /></div>
          <div><label className="form-label">Profession / Role *</label><input className="form-input" value={p.role} onChange={e => updateField('role', e.target.value)} placeholder="e.g. Full-Stack Developer" /></div>
          <div style={{ gridColumn: '1/-1' }}><label className="form-label">Headline / Tagline</label><input className="form-input" value={p.headline} onChange={e => updateField('headline', e.target.value)} placeholder="A compelling one-liner" /></div>
          <div style={{ gridColumn: '1/-1' }}><label className="form-label">About Me</label><textarea className="form-textarea" style={{ minHeight: 130 }} value={p.about} onChange={e => updateField('about', e.target.value)} placeholder="Tell visitors about yourself..." /></div>
          <div><label className="form-label">Email</label><input className="form-input" type="email" value={p.email} onChange={e => updateField('email', e.target.value)} placeholder="hello@yourname.com" /></div>
          <div><label className="form-label">Location</label><input className="form-input" value={p.location} onChange={e => updateField('location', e.target.value)} placeholder="City, Country" /></div>
          <div><label className="form-label">Phone</label><input className="form-input" value={p.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+1 555 000-0000" /></div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-head"><span>📷</span> Profile Photo</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#10101a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {p.profilePhoto ? (
              <img src={p.profilePhoto} alt="Profile preview" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', background: '#f5f5f5', padding: 2, transform: 'scale(1.02)' }} />
            ) : (
              <span style={{ fontSize: '1.45rem', fontWeight: 700 }}>{(p.name || 'ME').split(' ').map(part => part[0]).join('').slice(0,2).toUpperCase() || 'ME'}</span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <label className="btn-ghost btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
              Upload Photo
              <input type="file" accept="image/*" onChange={handleProfilePhotoUpload} style={{ display: 'none' }} />
            </label>
            {p.profilePhoto && (
              <button type="button" className="btn-ghost btn-sm" onClick={() => updateField('profilePhoto', '')}>Remove</button>
            )}
          </div>
        </div>

        {p.profilePhoto && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#d9d2c8', fontSize: '0.9rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={p.showProfilePhoto}
              onChange={e => updateField('showProfilePhoto', e.target.checked)}
            />
            Show this photo on the portfolio
          </label>
        )}
      </div>

      <div className="form-section">
        <div className="form-section-head"><span>🔗</span> Social Links</div>
        <div className="form-grid">
          {[['linkedin','LinkedIn','linkedin.com/in/...'],['github','GitHub','github.com/...'],['twitter','Twitter / X','@handle'],['website','Website','https://...'],['dribbble','Dribbble','dribbble.com/...'],['youtube','YouTube','youtube.com/...']].map(([k,l,ph]) => (
            <div key={k}><label className="form-label">{l}</label><input className="form-input" value={(p.social as any)[k]} onChange={e => updateField('social', { ...p.social, [k]: e.target.value })} placeholder={ph} /></div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <button className="btn-ghost btn-sm" onClick={() => toast.success('Saved!')}>Save</button>
        <button className="btn-primary btn-sm" onClick={() => { setSection('skills'); toast.success('Profile saved!') }}>Save & Continue →</button>
      </div>
    </div>
  )
}
