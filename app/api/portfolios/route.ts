// app/api/portfolios/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db'
import { Portfolio, Project, Experience, Education, Testimonial } from '@/lib/db/models'
import { z } from 'zod'

// ── GET /api/portfolios ──────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const userId = (session.user as any).id

    const portfolios = await Portfolio.find({ userId }).sort({ updatedAt: -1 }).lean()

    // Attach project count for each
    const result = await Promise.all(portfolios.map(async (p) => {
      const projectCount = await Project.countDocuments({ portfolioId: p._id.toString() })
      return { ...p, _id: p._id.toString(), projectCount }
    }))

    return NextResponse.json({ portfolios: result })

  } catch (err) {
    console.error('GET /portfolios error:', err)
    return NextResponse.json({ error: 'Failed to fetch portfolios' }, { status: 500 })
  }
}

// ── POST /api/portfolios ─────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const userId = (session.user as any).id
    const body   = await req.json()

    // FREE plan: max 1 portfolio
    const count = await Portfolio.countDocuments({ userId })
    const plan  = (session.user as any).plan || 'FREE'
    if (plan === 'FREE' && count >= 1) {
      return NextResponse.json({ error: 'Free plan allows 1 portfolio. Upgrade to Pro for unlimited.' }, { status: 403 })
    }

    const slug = `${(body.name || 'portfolio').toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`

    const portfolio = await Portfolio.create({
      userId,
      slug,
      name:     body.name     || 'My Portfolio',
      role:     body.role     || '',
      headline: body.headline || '',
      about:    body.about    || '',
      email:    body.email    || (session.user as any).email || '',
      theme:    body.theme    || { style: 'dark-luxury', accent: 'gold', font: 'playfair', layout: 'centered', tone: 'professional', animation: 'subtle' },
      sections: body.sections || { hero: true, about: true, skills: true, projects: true, experience: true, education: true, services: true, testimonials: true, achievements: true, contact: true },
    })

    return NextResponse.json({ portfolio: { ...portfolio.toObject(), _id: portfolio._id.toString() } }, { status: 201 })

  } catch (err) {
    console.error('POST /portfolios error:', err)
    return NextResponse.json({ error: 'Failed to create portfolio' }, { status: 500 })
  }
}
