// app/api/ai/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPortfolioSuggestions, generatePortfolioFromPrompt, improveField } from '@/lib/ai'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { action, data } = await req.json()

    switch (action) {
      case 'suggestions':
        const suggestions = await getPortfolioSuggestions(data)
        return NextResponse.json({ suggestions })

      case 'generate-from-prompt':
        if (!data?.prompt) return NextResponse.json({ error: 'Prompt required' }, { status: 400 })
        const portfolio = await generatePortfolioFromPrompt(data.prompt)
        return NextResponse.json({ portfolio })

      case 'improve-field':
        if (!data?.field || !data?.value) return NextResponse.json({ error: 'field and value required' }, { status: 400 })
        const improved = await improveField(data.field, data.value, data.context || '')
        return NextResponse.json({ improved })

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }

  } catch (err) {
    console.error('POST /ai error:', err)
    return NextResponse.json({ error: 'AI request failed. Check your ANTHROPIC_API_KEY.' }, { status: 500 })
  }
}
