// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/lib/db'
import { Portfolio, ContactMessage } from '@/lib/db/models'
import { sendContactEmail } from '@/lib/email'

const schema = z.object({
  portfolioId:  z.string().min(1),
  senderName:   z.string().min(2, 'Name must be at least 2 characters'),
  senderEmail:  z.string().email('Invalid email address'),
  message:      z.string().min(10, 'Message must be at least 10 characters'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { portfolioId, senderName, senderEmail, message } = schema.parse(body)

    await connectDB()

    const portfolio = await Portfolio.findById(portfolioId)
    if (!portfolio) return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })

    // Save message to MongoDB
    await ContactMessage.create({ portfolioId, senderName, senderEmail, message })

    // Email notification (non-blocking)
    if (portfolio.email) {
      sendContactEmail({
        ownerEmail:    portfolio.email,
        portfolioName: portfolio.name,
        senderName,
        senderEmail,
        message,
      }).catch(console.error)
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully!' })

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    console.error('POST /contact error:', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

// GET — fetch messages for a portfolio (owner only)
export async function GET(req: NextRequest) {
  try {
    const portfolioId = req.nextUrl.searchParams.get('portfolioId')
    if (!portfolioId) return NextResponse.json({ error: 'portfolioId required' }, { status: 400 })

    await connectDB()
    const messages = await ContactMessage.find({ portfolioId }).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ messages })

  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}
