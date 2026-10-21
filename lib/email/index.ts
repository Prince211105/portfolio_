// lib/email/index.ts — Nodemailer email sending
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST || 'smtp.gmail.com',
  port:   parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const FROM = process.env.EMAIL_FROM || 'PortfolioForge <noreply@portfolioforge.app>'

// ── Contact form email ────────────────────────────────────────
export async function sendContactEmail(opts: {
  ownerEmail: string
  portfolioName: string
  senderName: string
  senderEmail: string
  message: string
}): Promise<void> {
  await transporter.sendMail({
    from: FROM, to: opts.ownerEmail, replyTo: opts.senderEmail,
    subject: `New message from ${opts.senderName} via your portfolio`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#08080d;color:#edeae4;padding:2rem;border-radius:16px;border:1px solid rgba(201,168,76,0.25)">
        <div style="font-size:1.4rem;font-weight:700;color:#c9a84c;margin-bottom:1.5rem">PortfolioForge</div>
        <h2 style="font-size:1.1rem;margin-bottom:.5rem">New Contact Message</h2>
        <p style="color:#9b9488;font-size:.875rem;margin-bottom:1.5rem">Someone reached out through your <strong style="color:#edeae4">${opts.portfolioName}</strong> portfolio.</p>
        <div style="background:#13131e;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:1.5rem">
          <div style="margin-bottom:1rem">
            <div style="font-size:.65rem;text-transform:uppercase;letter-spacing:.08em;color:#625e58;margin-bottom:.3rem">From</div>
            <div style="font-weight:600">${opts.senderName}</div>
            <div style="color:#9b9488;font-size:.85rem">${opts.senderEmail}</div>
          </div>
          <div>
            <div style="font-size:.65rem;text-transform:uppercase;letter-spacing:.08em;color:#625e58;margin-bottom:.5rem">Message</div>
            <div style="color:#edeae4;font-size:.875rem;line-height:1.75;white-space:pre-line">${opts.message}</div>
          </div>
        </div>
        <a href="mailto:${opts.senderEmail}" style="display:inline-block;margin-top:1.5rem;background:linear-gradient(135deg,#c9a84c,#a87830);color:#080810;padding:.75rem 1.5rem;border-radius:10px;text-decoration:none;font-weight:700;font-size:.875rem">Reply to ${opts.senderName}</a>
      </div>`,
    text: `Message from ${opts.senderName} (${opts.senderEmail}):\n\n${opts.message}`,
  })
}

// ── Welcome email ─────────────────────────────────────────────
export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  await transporter.sendMail({
    from: FROM, to: email,
    subject: 'Welcome to PortfolioForge 🎉',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#08080d;color:#edeae4;padding:2rem;border-radius:16px;border:1px solid rgba(201,168,76,0.25)">
        <div style="font-size:1.4rem;font-weight:700;color:#c9a84c;margin-bottom:1.5rem">PortfolioForge</div>
        <h1 style="font-size:1.4rem;margin-bottom:.75rem">Welcome, ${name || 'Creator'}! 👋</h1>
        <p style="color:#9b9488;line-height:1.75;margin-bottom:1.5rem">Your account is ready. Build your stunning portfolio in minutes — no coding required.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#a87830);color:#080810;padding:.875rem 2rem;border-radius:10px;text-decoration:none;font-weight:700">Build My Portfolio →</a>
        <p style="color:#625e58;font-size:.8rem;margin-top:2rem">The PortfolioForge Team</p>
      </div>`,
  })
}
