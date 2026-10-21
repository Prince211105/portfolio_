// lib/ai/index.ts — Real AI via Anthropic Claude
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export interface AISuggestion {
  type: string
  label: string
  text: string
  suggestion?: string
}

// ── Portfolio improvement suggestions ────────────────────────
export async function getPortfolioSuggestions(data: {
  name: string; role: string; headline: string
  about: string; skills: string[]
  projects: { name: string; desc: string }[]
}): Promise<AISuggestion[]> {
  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1200,
      messages: [{
        role: 'user',
        content: `You are an expert portfolio consultant. Analyse this portfolio and give 6 specific actionable suggestions.

Portfolio:
- Name: ${data.name}
- Role: ${data.role}
- Headline: ${data.headline}
- About: ${data.about}
- Skills: ${data.skills.join(', ')}
- Projects: ${data.projects.map(p => p.name + ': ' + p.desc).join('\n')}

Return ONLY a JSON array of 6 objects with: type, label, text, suggestion (optional improved text).
No markdown, no explanation, just the JSON array.`
      }],
    })
    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return JSON.parse(text.trim())
  } catch {
    return getDefaultSuggestions()
  }
}

// ── Generate portfolio from prompt ──────────────────────────
export async function generatePortfolioFromPrompt(prompt: string): Promise<Record<string, any>> {
  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2000,
    system: `You are a portfolio builder AI. Extract structured data from user description.
Return ONLY valid JSON with keys: name, role, headline, about, skills(array), tools(array), services(array),
projects(array of {name,stack,desc,icon,category}), experience(array of {title,company,period,desc}),
theme(object with style,accent,font,layout,tone). Fill missing info with professional defaults.`,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

// ── Improve a specific field ─────────────────────────────────
export async function improveField(field: string, value: string, context: string): Promise<string> {
  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: `Improve this portfolio ${field}. Context: ${context}\n\nCurrent: "${value}"\n\nReturn ONLY the improved text, nothing else.`
    }],
  })
  return response.content[0].type === 'text' ? response.content[0].text.trim() : value
}

// ── Default fallback suggestions ─────────────────────────────
function getDefaultSuggestions(): AISuggestion[] {
  return [
    { type: 'Better Headline', label: 'Better Headline', text: 'Your headline should mention your specialisation and the value you provide.', suggestion: 'I design systems and ship code — products people actually love using.' },
    { type: 'About Me', label: 'About Me', text: 'Add a measurable achievement to your bio — makes your story concrete and memorable.' },
    { type: 'Section Order', label: 'Section Order', text: 'Consider placing Projects before Experience — your work speaks louder than job titles.' },
    { type: 'Testimonials', label: 'Add Testimonials', text: 'Adding 2–3 client testimonials can increase portfolio conversion by up to 60%.' },
    { type: 'CTA Copy', label: 'Contact CTA', text: 'Change "Get In Touch" to "Let\'s build something great together".', suggestion: "Let's build something great together" },
    { type: 'Skills', label: 'Skills', text: 'Group your skills by category (Frontend, Backend, Design) to make them easier to scan.' },
  ]
}
