// app/api/export/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db'
import { ExportHistory, Portfolio } from '@/lib/db/models'

// POST — log an export
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { portfolioId, format } = await req.json()
    if (!portfolioId || !format) return NextResponse.json({ error: 'portfolioId and format required' }, { status: 400 })

    await connectDB()
    const userId = (session.user as any).id

    const portfolio = await Portfolio.findOne({ _id: portfolioId, userId })
    if (!portfolio) return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })

    const record = await ExportHistory.create({ userId, portfolioId, format })
    return NextResponse.json({ success: true, record })

  } catch (err) {
    console.error('POST /export error:', err)
    return NextResponse.json({ error: 'Failed to log export' }, { status: 500 })
  }
}

// GET — fetch export history
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const userId = (session.user as any).id

    const history = await ExportHistory.find({ userId }).sort({ createdAt: -1 }).limit(50).lean()
    return NextResponse.json({ history })

  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}
