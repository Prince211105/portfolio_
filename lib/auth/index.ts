// lib/auth/index.ts — NextAuth with MongoDB
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/db'
import { User, Portfolio } from '@/lib/db/models'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: {
    signIn:  '/auth/login',
    error:   '/auth/error',
  },

  providers: [
    // ── Email + Password ──────────────────────────────────
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email aur password zaroori hain')
        }

        await connectDB()
        const user = await User.findOne({ email: credentials.email.toLowerCase() })

        if (!user) throw new Error('Is email se koi account nahi mila')
        if (!user.password) throw new Error('Please Google/GitHub se login karo')

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) throw new Error('Password galat hai')

        return {
          id:    user._id.toString(),
          email: user.email,
          name:  user.name,
          image: user.image,
          plan:  user.plan,
        }
      },
    }),

    // ── Google OAuth ──────────────────────────────────────
    ...(process.env.GOOGLE_CLIENT_ID ? [
      GoogleProvider({
        clientId:     process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ] : []),

    // ── GitHub OAuth ──────────────────────────────────────
    ...(process.env.GITHUB_CLIENT_ID ? [
      GitHubProvider({
        clientId:     process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      }),
    ] : []),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      // OAuth sign-in: create user in MongoDB if not exists
      if (account?.provider !== 'credentials') {
        await connectDB()
        const existing = await User.findOne({ email: user.email?.toLowerCase() })
        if (!existing) {
          const newUser = await User.create({
            email: user.email?.toLowerCase(),
            name:  user.name || user.email?.split('@')[0],
            image: user.image || '',
            plan:  'FREE',
          })
          // Auto-create starter portfolio
          await createStarterPortfolio(newUser._id.toString(), newUser.name || 'User')
        }
      }
      return true
    },

    async jwt({ token, user }) {
      if (user) {
        token.id   = (user as any).id
        token.plan = (user as any).plan || 'FREE'
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id   = token.id
        ;(session.user as any).plan = token.plan
      }
      return session
    },
  },
}

// Auto-create starter portfolio for new users
async function createStarterPortfolio(userId: string, name: string) {
  try {
    const slug = `portfolio-${userId.slice(-8)}-${Date.now().toString(36)}`
    await Portfolio.create({
      userId,
      slug,
      name,
      role:     'Professional',
      headline: 'Welcome to my portfolio',
      about:    'Tell your story here...',
      theme: { style: 'dark-luxury', accent: 'gold', font: 'playfair', layout: 'centered', tone: 'professional', animation: 'subtle' },
      sections: { hero: true, about: true, skills: true, projects: true, experience: true, education: true, services: true, testimonials: true, achievements: true, contact: true },
    })
  } catch (err) {
    console.error('Failed to create starter portfolio:', err)
  }
}
