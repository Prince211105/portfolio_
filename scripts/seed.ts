// scripts/seed.ts — Seed MongoDB with demo data
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolioforge'

// ── Inline schemas (avoid module resolution issues in seed) ──
const UserSchema = new mongoose.Schema({
  email: String, name: String, password: String, image: String, plan: String,
}, { timestamps: true })

const PortfolioSchema = new mongoose.Schema({
  userId: String, slug: String, published: Boolean,
  name: String, role: String, headline: String, about: String,
  email: String, location: String, phone: String,
  social: Object, skills: [String], tools: [String], services: [String],
  achievements: [String], certifications: [String],
  theme: Object, sections: Object,
  seoTitle: String, seoDesc: String, profilePhoto: String,
}, { timestamps: true })

const ProjectSchema = new mongoose.Schema({
  portfolioId: String, order: Number, name: String, stack: String,
  desc: String, longDesc: String, icon: String, category: String,
  year: String, role: String, liveUrl: String, githubUrl: String,
  featured: Boolean, highlights: [String], images: [Object],
}, { timestamps: true })

const ExperienceSchema = new mongoose.Schema({
  portfolioId: String, order: Number, title: String, company: String,
  period: String, desc: String, current: Boolean,
})

const EducationSchema = new mongoose.Schema({
  portfolioId: String, order: Number, degree: String,
  school: String, year: String, desc: String,
})

const TestimonialSchema = new mongoose.Schema({
  portfolioId: String, order: Number, text: String,
  name: String, role: String, initials: String, color: String,
})

const User        = mongoose.models.User        || mongoose.model('User',        UserSchema)
const Portfolio   = mongoose.models.Portfolio   || mongoose.model('Portfolio',   PortfolioSchema)
const Project     = mongoose.models.Project     || mongoose.model('Project',     ProjectSchema)
const Experience  = mongoose.models.Experience  || mongoose.model('Experience',  ExperienceSchema)
const Education   = mongoose.models.Education   || mongoose.model('Education',   EducationSchema)
const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema)

async function seed() {
  console.log('\n🌱 PortfolioForge Seeder')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Connecting to:', MONGODB_URI)

  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected to MongoDB\n')

  // Remove existing demo user
  const existing = await User.findOne({ email: 'demo@portfolioforge.app' })
  if (existing) {
    await User.deleteOne({ email: 'demo@portfolioforge.app' })
    await Portfolio.deleteMany({ userId: existing._id.toString() })
    const portfolios = await Portfolio.find({ userId: existing._id.toString() })
    for (const p of portfolios) {
      await Project.deleteMany({ portfolioId: p._id.toString() })
      await Experience.deleteMany({ portfolioId: p._id.toString() })
      await Education.deleteMany({ portfolioId: p._id.toString() })
      await Testimonial.deleteMany({ portfolioId: p._id.toString() })
    }
    console.log('🗑️  Cleaned old demo data')
  }

  // Create demo user
  const hashed = await bcrypt.hash('demo1234', 12)
  const user = await User.create({
    name:  'Alexandra Rivera',
    email: 'demo@portfolioforge.app',
    password: hashed,
    plan: 'FREE',
  })
  console.log('✅ User created:', user.email)

  // Create portfolio
  const portfolio = await Portfolio.create({
    userId:    user._id.toString(),
    slug:      'alexandra-rivera-portfolio',
    published: true,
    name:      'Alexandra Rivera',
    role:      'Product Designer & Developer',
    headline:  'I craft digital experiences that feel alive.',
    about:     "I'm a multidisciplinary designer and developer with 6+ years of experience building products that combine beautiful aesthetics with robust engineering. I love working at the intersection of design and code.",
    email:     'alex@example.com',
    location:  'San Francisco, CA',
    social: {
      linkedin: 'linkedin.com/in/alexrivera',
      github:   'github.com/alexrivera',
      twitter:  '@alexrivera_dev',
      website:  '', dribbble: '', youtube: '',
    },
    skills:    ['React', 'TypeScript', 'Node.js', 'Figma', 'Python', 'PostgreSQL', 'Design Systems', 'UX Research'],
    tools:     ['VS Code', 'Framer', 'Notion', 'Linear', 'Vercel', 'AWS'],
    services:  ['UI/UX Design', 'Frontend Development', 'Design Systems', 'Prototyping', 'Brand Identity'],
    achievements: [
      'Speaker at Figma Config 2023',
      'Open source contributor (2k+ GitHub stars)',
      'Featured in "30 Under 30 Designers" – Design Weekly',
    ],
    certifications: ['Google UX Design Certificate', 'AWS Certified Developer – Associate'],
    theme: {
      style: 'dark-luxury', accent: 'gold', font: 'playfair',
      layout: 'centered', tone: 'professional', animation: 'subtle',
    },
    sections: {
      hero: true, about: true, skills: true, projects: true,
      experience: true, education: true, services: true,
      testimonials: true, achievements: true, contact: true,
    },
    seoTitle: 'Alexandra Rivera — Product Designer & Developer',
    seoDesc:  'Portfolio of Alexandra Rivera, a product designer and developer based in San Francisco.',
  })
  console.log('✅ Portfolio created:', portfolio.slug)

  const pid = portfolio._id.toString()

  // Projects
  await Project.insertMany([
    {
      portfolioId: pid, order: 0, featured: true,
      name: 'Aura Design System', icon: '🎨',
      stack: 'React · Storybook · Figma',
      category: 'Design System', year: '2023',
      role: 'Lead Designer & Developer',
      desc: 'A comprehensive design system used across 4 product teams, featuring 80+ components and a full token architecture.',
      longDesc: 'Aura is a full-featured design system built to unify product experiences across a multi-team organisation. It includes a complete Figma token library, a React component library with 80+ accessible components, comprehensive Storybook documentation, and automated visual regression testing.',
      highlights: [
        '80+ React components with full accessibility (WCAG 2.1 AA)',
        'Reduced design inconsistencies by 90% across 4 product teams',
        'Automated visual regression testing with Chromatic',
        'Full Figma token integration with style-dictionary',
      ],
      images: [], liveUrl: '', githubUrl: '',
    },
    {
      portfolioId: pid, order: 1, featured: true,
      name: 'Fintech Mobile App', icon: '📱',
      stack: 'React Native · TypeScript · GraphQL',
      category: 'Mobile App', year: '2022',
      role: 'Product Designer & Frontend Lead',
      desc: 'End-to-end redesign of a banking app serving 200k users. Increased daily active usage by 38%.',
      longDesc: 'A complete redesign and rebuild of a consumer banking application. The project involved user research, UX strategy, visual design, and full React Native implementation. Key challenges included complex data visualisation and strict regulatory compliance.',
      highlights: [
        '38% increase in daily active users post-launch',
        '4.8-star App Store rating (previously 3.2)',
        'Real-time transaction notifications with WebSocket',
        'Biometric authentication with fallback PIN',
      ],
      images: [], liveUrl: '', githubUrl: '',
    },
    {
      portfolioId: pid, order: 2, featured: false,
      name: 'E-Commerce Platform', icon: '🛒',
      stack: 'Next.js · PostgreSQL · Stripe',
      category: 'Web Application', year: '2023',
      role: 'Full-Stack Developer',
      desc: 'Full-stack e-commerce solution with real-time inventory, custom checkout flow, and analytics dashboard.',
      longDesc: 'A full-stack e-commerce platform built for a lifestyle brand with 50k+ monthly visitors. Features include a custom product configurator, real-time inventory management, and Stripe-powered checkout.',
      highlights: [
        '$1.2M processed in first 6 months',
        '99.9% uptime with zero payment failures',
        'Core Web Vitals: LCP < 1.2s, CLS < 0.05',
        'Automated order fulfilment — 80% less manual work',
      ],
      images: [], liveUrl: '', githubUrl: '',
    },
  ])
  console.log('✅ Projects created (3)')

  // Experience
  await Experience.insertMany([
    { portfolioId: pid, order: 0, current: true,  title: 'Senior Product Designer', company: 'Luma Technologies', period: '2021 – Present', desc: 'Leading design for the core product and design system. Shipped 12 major features used by 500k+ users.' },
    { portfolioId: pid, order: 1, current: false, title: 'Frontend Developer',       company: 'Pixel Studio',       period: '2019 – 2021',   desc: 'Built React applications, maintained component library, and collaborated closely with design and product.' },
    { portfolioId: pid, order: 2, current: false, title: 'UX Designer',              company: 'Freelance',          period: '2017 – 2019',   desc: 'Worked with 20+ clients across fintech, health, and e-commerce to deliver user-centred digital products.' },
  ])
  console.log('✅ Experience created (3)')

  // Education
  await Education.create({
    portfolioId: pid, order: 0,
    degree: 'B.Sc. Computer Science',
    school: 'UC Berkeley', year: '2017',
    desc: 'Focus on Human-Computer Interaction and Software Engineering.',
  })
  console.log('✅ Education created (1)')

  // Testimonials
  await Testimonial.insertMany([
    { portfolioId: pid, order: 0, initials: 'JL', color: '#c9a84c', name: 'James Liu',  role: 'CTO, Luma Technologies', text: 'Alex transformed our product in record time. The design is beautiful and the code is impeccable.' },
    { portfolioId: pid, order: 1, initials: 'PM', color: '#8b5cf6', name: 'Priya Mehta', role: 'Founder, Sprout App',     text: 'Working with Alex was effortless. She understood our vision immediately and delivered beyond expectations.' },
  ])
  console.log('✅ Testimonials created (2)')

  console.log('\n🎉 Seed complete!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Demo Login:')
  console.log('  Email:    demo@portfolioforge.app')
  console.log('  Password: demo1234')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch(err => {
  console.error('\n❌ Seed failed:', err.message)
  process.exit(1)
})
