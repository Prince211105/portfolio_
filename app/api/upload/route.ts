// app/api/upload/route.ts — Local image storage
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db'
import { Project, Portfolio } from '@/lib/db/models'
import { saveImage, deleteImage } from '@/lib/upload'

// ── POST /api/upload ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 })
    }

    const formData  = await req.formData()
    const file      = formData.get('file')      as File | null
    const projectId = formData.get('projectId') as string | null
    const type      = (formData.get('type') as string) || 'project'
    const caption   = (formData.get('caption') as string) || ''
    const order     = parseInt(formData.get('order') as string || '0')

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate type
    const allowed = ['image/jpeg','image/jpg','image/png','image/webp','image/gif']
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, WebP, GIF allowed' }, { status: 400 })
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 })
    }

    // Convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Save to local disk (sharp optimises + converts to WebP)
    const uploadType = type === 'profile' ? 'profile' : 'project'
    const result = await saveImage(buffer, uploadType, file.name)

    await connectDB()
    const userId = (session.user as any).id

    // ── Profile photo: update portfolio ──────────────────────
    if (type === 'profile') {
      const portfolioId = formData.get('portfolioId') as string
      if (portfolioId) {
        const portfolio = await Portfolio.findOne({ _id: portfolioId, userId })
        if (portfolio) {
          // Delete old profile photo
          if (portfolio.profilePhoto) {
            const oldFile = portfolio.profilePhoto.split('/').pop()!
            deleteImage(oldFile, 'profile')
          }
          portfolio.profilePhoto = result.url
          await portfolio.save()
        }
      }
      return NextResponse.json({ success: true, url: result.url, filename: result.filename })
    }

    // ── Project image: add to project.images array ────────────
    if (projectId) {
      const project = await Project.findOne({ _id: projectId })
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }

      // Verify ownership via portfolio
      const portfolio = await Portfolio.findOne({ _id: project.portfolioId, userId })
      if (!portfolio) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }

      const newImage = {
        id:       result.filename.replace('.webp', ''),
        url:      result.url,
        filename: result.filename,
        caption:  caption || file.name.replace(/\.[^/.]+$/, ''),
        alt:      caption || file.name,
        order,
        size:     result.size,
        mimetype: result.mimetype,
        createdAt: new Date(),
      }

      project.images.push(newImage as any)
      await project.save()

      return NextResponse.json({
        success: true,
        image: newImage,
        url: result.url,
      })
    }

    return NextResponse.json({ success: true, url: result.url, filename: result.filename })

  } catch (err) {
    console.error('POST /upload error:', err)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}

// ── DELETE /api/upload ───────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 })
    }

    const { projectId, imageId, filename, type } = await req.json()

    if (!filename) {
      return NextResponse.json({ error: 'filename required' }, { status: 400 })
    }

    await connectDB()
    const userId = (session.user as any).id

    // Remove from project images array
    if (projectId && imageId) {
      const project = await Project.findOne({ _id: projectId })
      if (project) {
        const portfolio = await Portfolio.findOne({ _id: project.portfolioId, userId })
        if (!portfolio) return NextResponse.json({ error: 'Access denied' }, { status: 403 })

        project.images = project.images.filter((img: any) => img.id !== imageId)
        await project.save()
      }
    }

    // Remove from profile photo
    if (type === 'profile') {
      await Portfolio.updateMany({ userId, profilePhoto: `/uploads/profiles/${filename}` }, { $set: { profilePhoto: '' } })
    }

    // Delete file from disk
    const imgType = type === 'profile' ? 'profile' : 'project'
    deleteImage(filename, imgType)

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('DELETE /upload error:', err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
