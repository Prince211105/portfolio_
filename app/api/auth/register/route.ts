// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import connectDB from '@/lib/db'
import { User, Portfolio } from '@/lib/db/models'
import { sendWelcomeEmail } from '@/lib/email'

const schema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password } = schema.parse(body)

    await connectDB()

    // Check existing user
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 12)

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      plan: 'FREE',
    })

    // Create starter portfolio
    const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`
    await Portfolio.create({
      userId:   user._id.toString(),
      slug,
      name,
      role:     'Professional',
      headline: `Hi, I'm ${name}`,
      about:    'Tell your story here...',
      email:    email.toLowerCase(),
      skills:   [],
      tools:    [],
      services: [],
      theme: { style: 'dark-luxury', accent: 'gold', font: 'playfair', layout: 'centered', tone: 'professional', animation: 'subtle' },
      sections: { hero: true, about: true, skills: true, projects: true, experience: true, education: true, services: true, testimonials: true, achievements: true, contact: true },
    })

    // Welcome email (non-blocking)
    sendWelcomeEmail(email, name).catch(console.error)

    return NextResponse.json({
      success: true,
      user: { id: user._id.toString(), email: user.email, name: user.name },
    }, { status: 201 })

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
  }
}
