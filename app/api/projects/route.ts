// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db'
import { Project, Portfolio } from '@/lib/db/models'
import { deleteImage } from '@/lib/upload'

// ── GET /api/projects?portfolioId=xxx ────────────────────────
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const portfolioId = req.nextUrl.searchParams.get('portfolioId')
    if (!portfolioId) return NextResponse.json({ error: 'portfolioId required' }, { status: 400 })

    await connectDB()
    const userId = (session.user as any).id

    // Verify ownership
    const portfolio = await Portfolio.findOne({ _id: portfolioId, userId })
    if (!portfolio) return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })

    const projects = await Project.find({ portfolioId }).sort({ order: 1 }).lean()
    return NextResponse.json({ projects: projects.map(p => ({ ...p, _id: (p._id as any).toString() })) })

  } catch (err) {
    console.error('GET /projects error:', err)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// ── POST /api/projects — create ──────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const userId = (session.user as any).id
    const body   = await req.json()

    if (!body.portfolioId) return NextResponse.json({ error: 'portfolioId required' }, { status: 400 })

    // Verify ownership
    const portfolio = await Portfolio.findOne({ _id: body.portfolioId, userId })
    if (!portfolio) return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })

    const count = await Project.countDocuments({ portfolioId: body.portfolioId })
    const project = await Project.create({
      portfolioId: body.portfolioId,
      order:       body.order ?? count,
      name:        body.name        || 'New Project',
      stack:       body.stack       || '',
      desc:        body.desc        || '',
      longDesc:    body.longDesc    || '',
      icon:        body.icon        || '💡',
      category:    body.category    || 'Web Application',
      year:        body.year        || new Date().getFullYear().toString(),
      role:        body.role        || '',
      liveUrl:     body.liveUrl     || '',
      githubUrl:   body.githubUrl   || '',
      featured:    body.featured    ?? false,
      highlights:  body.highlights  || [],
      images:      [],
    })

    return NextResponse.json({ project: { ...project.toObject(), _id: project._id.toString() } }, { status: 201 })

  } catch (err) {
    console.error('POST /projects error:', err)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

// ── PUT /api/projects — update ───────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const userId = (session.user as any).id
    const body   = await req.json()

    if (!body._id) return NextResponse.json({ error: 'Project _id required' }, { status: 400 })

    const project = await Project.findById(body._id)
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    // Verify ownership
    const portfolio = await Portfolio.findOne({ _id: project.portfolioId, userId })
    if (!portfolio) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    const allowed = ['name','stack','desc','longDesc','icon','category','year','role',
      'liveUrl','githubUrl','featured','highlights','order']
    allowed.forEach(key => { if (body[key] !== undefined) (project as any)[key] = body[key] })

    await project.save()
    return NextResponse.json({ project: { ...project.toObject(), _id: project._id.toString() } })

  } catch (err) {
    console.error('PUT /projects error:', err)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

// ── DELETE /api/projects ─────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const userId  = (session.user as any).id
    const { id }  = await req.json()

    const project = await Project.findById(id)
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    const portfolio = await Portfolio.findOne({ _id: project.portfolioId, userId })
    if (!portfolio) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    // Delete all local images
    project.images?.forEach((img: any) => {
      if (img.filename) deleteImage(img.filename, 'project')
    })

    await Project.deleteOne({ _id: id })
    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('DELETE /projects error:', err)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
