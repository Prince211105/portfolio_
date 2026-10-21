// app/api/portfolios/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db'
import { Portfolio, Project, Experience, Education, Testimonial } from '@/lib/db/models'
import { deleteImage } from '@/lib/upload'

type Ctx = { params: { id: string } }

// ── GET /api/portfolios/[id] — full portfolio with all data ──
export async function GET(req: NextRequest, { params }: Ctx) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const userId = (session.user as any).id

    const portfolio = await Portfolio.findOne({ _id: params.id, userId }).lean()
    if (!portfolio) return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })

    const [projects, experiences, educations, testimonials] = await Promise.all([
      Project.find({ portfolioId: params.id }).sort({ order: 1 }).lean(),
      Experience.find({ portfolioId: params.id }).sort({ order: 1 }).lean(),
      Education.find({ portfolioId: params.id }).sort({ order: 1 }).lean(),
      Testimonial.find({ portfolioId: params.id }).sort({ order: 1 }).lean(),
    ])

    return NextResponse.json({
      portfolio: {
        ...portfolio,
        _id: (portfolio._id as any).toString(),
        projects:     projects.map(p => ({ ...p, _id: (p._id as any).toString() })),
        experience:   experiences.map(e => ({ ...e, _id: (e._id as any).toString() })),
        education:    educations.map(e => ({ ...e, _id: (e._id as any).toString() })),
        testimonials: testimonials.map(t => ({ ...t, _id: (t._id as any).toString() })),
      }
    })

  } catch (err) {
    console.error('GET /portfolios/[id] error:', err)
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
  }
}

// ── PUT /api/portfolios/[id] — update portfolio ──────────────
export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const userId = (session.user as any).id
    const body   = await req.json()

    const portfolio = await Portfolio.findOne({ _id: params.id, userId })
    if (!portfolio) return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })

    // Update only allowed fields
    const allowed = ['name','role','headline','about','email','location','phone','social',
      'skills','tools','services','achievements','certifications','theme','sections',
      'seoTitle','seoDesc','seoImage','analytics','published']
    allowed.forEach(key => { if (body[key] !== undefined) (portfolio as any)[key] = body[key] })

    await portfolio.save()
    return NextResponse.json({ portfolio: { ...portfolio.toObject(), _id: portfolio._id.toString() } })

  } catch (err) {
    console.error('PUT /portfolios/[id] error:', err)
    return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 })
  }
}

// ── DELETE /api/portfolios/[id] ──────────────────────────────
export async function DELETE(req: NextRequest, { params }: Ctx) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const userId = (session.user as any).id

    const portfolio = await Portfolio.findOne({ _id: params.id, userId })
    if (!portfolio) return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })

    // Delete all project images from disk
    const projects = await Project.find({ portfolioId: params.id })
    for (const project of projects) {
      project.images?.forEach((img: any) => {
        if (img.filename) deleteImage(img.filename, 'project')
      })
    }

    // Delete profile photo
    if (portfolio.profilePhoto) {
      const fname = portfolio.profilePhoto.split('/').pop()!
      deleteImage(fname, 'profile')
    }

    // Delete all related documents
    await Promise.all([
      Project.deleteMany({ portfolioId: params.id }),
      Experience.deleteMany({ portfolioId: params.id }),
      Education.deleteMany({ portfolioId: params.id }),
      Testimonial.deleteMany({ portfolioId: params.id }),
      Portfolio.deleteOne({ _id: params.id }),
    ])

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('DELETE /portfolios/[id] error:', err)
    return NextResponse.json({ error: 'Failed to delete portfolio' }, { status: 500 })
  }
}
