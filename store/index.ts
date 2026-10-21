'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PortfolioData, BuilderSection, PreviewMode, Project, Experience, Education, Testimonial, ThemeSettings, SectionVisibility } from '@/types'

// ─── EMPTY defaults — user fills their own data ───────────────
export const emptyPortfolio: PortfolioData = {
  name: '', role: '', headline: '', about: '',
  email: '', location: '', phone: '',
  social: { linkedin: '', github: '', twitter: '', website: '', dribbble: '', youtube: '' },
  skills: [], tools: [], services: [],
  projects: [], experience: [], education: [],
  testimonials: [], achievements: [], certifications: [],
  theme: { style: 'dark-luxury', accent: 'gold', font: 'playfair', layout: 'centered', tone: 'professional', animation: 'subtle' },
  sections: { hero: true, about: true, skills: true, projects: true, experience: true, education: true, services: true, testimonials: true, achievements: true, contact: true },
  profilePhoto: '', showProfilePhoto: true,
  seoTitle: '', seoDesc: '', seoImage: '', analytics: '',
  lastSaved: new Date().toISOString(), version: '1.0.0',
}

interface Store {
  portfolio: PortfolioData
  currentSection: BuilderSection
  previewMode: PreviewMode
  isDirty: boolean
  selectedTemplate: string

  updateField: <K extends keyof PortfolioData>(key: K, value: PortfolioData[K]) => void
  updateTheme: (u: Partial<ThemeSettings>) => void
  updateSections: (u: Partial<SectionVisibility>) => void
  setSelectedTemplate: (t: string) => void

  addSkill: (s: string) => void
  removeSkill: (i: number) => void
  addTool: (t: string) => void
  removeTool: (i: number) => void
  addService: (s: string) => void
  removeService: (i: number) => void

  addProject: () => void
  updateProject: (id: string, u: Partial<Project>) => void
  removeProject: (id: string) => void

  addExperience: () => void
  updateExperience: (id: string, u: Partial<Experience>) => void
  removeExperience: (id: string) => void

  addEducation: () => void
  updateEducation: (id: string, u: Partial<Education>) => void
  removeEducation: (id: string) => void

  addTestimonial: () => void
  updateTestimonial: (id: string, u: Partial<Testimonial>) => void
  removeTestimonial: (id: string) => void

  setSection: (s: BuilderSection) => void
  setPreviewMode: (m: PreviewMode) => void
  saveToLocal: () => void
  backupPortfolio: () => void
  restorePortfolio: () => void
  resetPortfolio: () => void
  loadTemplate: (template: string) => void
}

// ─── TEMPLATES — 6 premium, distinct personas ───────────────────────────
const TEMPLATES: Record<string, Partial<PortfolioData>> = {
  'noir-executive': {
    name: 'Aarav Mehta', role: 'Founder & Strategy Lead',
    headline: 'Building ventures with clarity, momentum, and measurable results.',
    about: 'Strategic leader with 7+ years helping startups and growing businesses turn vision into execution. I combine product thinking, customer insight, and growth systems to move ambitious ideas forward with confidence.',
    skills: ['Strategy','Leadership','Growth','Roadmapping','Analytics','Positioning'],
    tools: ['Notion','Figma','Mixpanel','Jira','Slack','Amplitude'],
    services: ['Business Strategy','Product Advisory','Growth Planning','Brand Positioning','Go-to-Market'],
    theme: { style: 'dark-luxury', accent: 'gold', font: 'space', layout: 'left-aligned', tone: 'professional', animation: 'subtle' },
  },
  'aurora-studio': {
    name: 'Maya Patel', role: 'Brand & Visual Designer',
    headline: 'Designing memorable brands and thoughtful digital experiences.',
    about: 'Multidisciplinary designer crafting expressive brand systems, polished interfaces, and immersive digital stories. I blend research, strategy, and visual clarity to create work that feels premium and purposeful.',
    skills: ['Brand Identity','UX Design','Art Direction','Systems Thinking','Visual Design','Prototyping'],
    tools: ['Figma','Framer','Notion','Miro','Illustrator','After Effects'],
    services: ['Brand Identity','UI/UX Design','Creative Direction','Design Systems','Art Direction'],
    theme: { style: 'bold-creative', accent: 'purple', font: 'syne', layout: 'centered', tone: 'creative', animation: 'expressive' },
  },
  'ivory-editorial': {
    name: 'Jordan Mills', role: 'Writer & Content Strategist',
    headline: 'Turning ideas into words that inspire action and trust.',
    about: 'Editorial strategist and writer helping brands communicate clearly, consistently, and with impact. I specialise in thought leadership, storytelling, and content systems that move audiences and strengthen brands.',
    skills: ['Content Strategy','Brand Voice','SEO','Copywriting','Storytelling','Editorial'],
    tools: ['Notion','Ahrefs','WordPress','Canva','Google Docs','Slack'],
    services: ['SEO Content','Brand Messaging','Editorial Strategy','Thought Leadership','Content Systems'],
    theme: { style: 'light-minimal', accent: 'gold', font: 'playfair', layout: 'magazine', tone: 'friendly', animation: 'none' },
  },
  'solar-atelier': {
    name: 'Sam Rivera', role: 'Photographer & Visual Artist',
    headline: 'Capturing atmosphere, emotion, and identity through the lens.',
    about: 'Photographer and visual artist building cinematic portraits, editorial stories, and commercial imagery with a distinct eye for light, emotion, and atmosphere. My work balances craft, personality, and narrative power.',
    skills: ['Portrait Photography','Editorial','Commercial','Lightroom','Composition','Retouching'],
    tools: ['Adobe Lightroom','Photoshop','Capture One','Canon','Canva'],
    services: ['Portrait Sessions','Commercial Photography','Event Coverage','Brand Image Creation','Retouching'],
    theme: { style: 'warm-editorial', accent: 'rose', font: 'syne', layout: 'magazine', tone: 'creative', animation: 'subtle' },
  },
  'neon-dev': {
    name: 'Alex Chen', role: 'Full-Stack Engineer',
    headline: 'Building elegant digital products that scale with the mission.',
    about: 'Full-stack developer focused on reliable systems, strong product thinking, and polished user experiences. I design and ship scalable web platforms with a practical, performance-first mindset.',
    skills: ['React','TypeScript','Node.js','Architecture','Cloud','Performance'],
    tools: ['VS Code','Docker','AWS','Postman','GitHub','Figma'],
    services: ['Web App Development','API Design','System Architecture','Frontend Engineering','Product Delivery'],
    theme: { style: 'tech-clean', accent: 'teal', font: 'space', layout: 'left-aligned', tone: 'technical', animation: 'subtle' },
  },
  'luxe-freelance': {
    name: 'Dana Kim', role: 'Brand Designer & Illustrator',
    headline: 'Creating identities that feel premium, human, and unforgettable.',
    about: 'Brand designer and illustrator helping businesses shape warm, memorable visual identities that connect emotionally and translate beautifully across every touchpoint. I care deeply about craft, clarity, and consistency.',
    skills: ['Brand Identity','Illustration','Typography','Packaging','Print Design','Visual Storytelling'],
    tools: ['Illustrator','Photoshop','Figma','Procreate','InDesign','Behance'],
    services: ['Brand Identity','Logo Design','Packaging Design','Illustration','Marketing Design'],
    theme: { style: 'warm-editorial', accent: 'orange', font: 'playfair', layout: 'centered', tone: 'friendly', animation: 'subtle' },
  },
}

export const usePortfolioStore = create<Store>()(
  persist(
    (set, get) => ({
      portfolio: emptyPortfolio,
      currentSection: 'profile',
      previewMode: 'desktop',
      isDirty: false,
      selectedTemplate: '',

      updateField: (key, value) => set(s => ({
        portfolio: { ...s.portfolio, [key]: value, lastSaved: new Date().toISOString() },
        isDirty: true,
      })),
      updateTheme: (u) => set(s => ({
        portfolio: { ...s.portfolio, theme: { ...s.portfolio.theme, ...u } },
        isDirty: true,
      })),
      updateSections: (u) => set(s => ({
        portfolio: { ...s.portfolio, sections: { ...s.portfolio.sections, ...u } },
        isDirty: true,
      })),
      setSelectedTemplate: (t) => set({ selectedTemplate: t }),

      addSkill: (s) => set(st => ({ portfolio: { ...st.portfolio, skills: [...st.portfolio.skills, s] }, isDirty: true })),
      removeSkill: (i) => set(s => ({ portfolio: { ...s.portfolio, skills: s.portfolio.skills.filter((_, j) => j !== i) }, isDirty: true })),
      addTool: (t) => set(s => ({ portfolio: { ...s.portfolio, tools: [...s.portfolio.tools, t] }, isDirty: true })),
      removeTool: (i) => set(s => ({ portfolio: { ...s.portfolio, tools: s.portfolio.tools.filter((_, j) => j !== i) }, isDirty: true })),
      addService: (sv) => set(s => ({ portfolio: { ...s.portfolio, services: [...s.portfolio.services, sv] }, isDirty: true })),
      removeService: (i) => set(s => ({ portfolio: { ...s.portfolio, services: s.portfolio.services.filter((_, j) => j !== i) }, isDirty: true })),

      addProject: () => set(s => ({
        portfolio: { ...s.portfolio, projects: [...s.portfolio.projects, { id: Date.now().toString(), name: '', stack: '', desc: '', longDesc: '', icon: '💡', liveUrl: '', githubUrl: '', category: 'Web Application', year: new Date().getFullYear().toString(), role: '', highlights: [], images: [], featured: false }] },
        isDirty: true,
      })),
      updateProject: (id, u) => set(s => ({
        portfolio: { ...s.portfolio, projects: s.portfolio.projects.map(p => p.id === id ? { ...p, ...u } : p) },
        isDirty: true,
      })),
      removeProject: (id) => set(s => ({
        portfolio: { ...s.portfolio, projects: s.portfolio.projects.filter(p => p.id !== id) },
        isDirty: true,
      })),

      addExperience: () => set(s => ({
        portfolio: { ...s.portfolio, experience: [...s.portfolio.experience, { id: Date.now().toString(), title: '', company: '', period: '', desc: '', current: false }] },
        isDirty: true,
      })),
      updateExperience: (id, u) => set(s => ({
        portfolio: { ...s.portfolio, experience: s.portfolio.experience.map(e => e.id === id ? { ...e, ...u } : e) },
        isDirty: true,
      })),
      removeExperience: (id) => set(s => ({
        portfolio: { ...s.portfolio, experience: s.portfolio.experience.filter(e => e.id !== id) },
        isDirty: true,
      })),

      addEducation: () => set(s => ({
        portfolio: { ...s.portfolio, education: [...s.portfolio.education, { id: Date.now().toString(), degree: '', school: '', year: '', desc: '' }] },
        isDirty: true,
      })),
      updateEducation: (id, u) => set(s => ({
        portfolio: { ...s.portfolio, education: s.portfolio.education.map(e => e.id === id ? { ...e, ...u } : e) },
        isDirty: true,
      })),
      removeEducation: (id) => set(s => ({
        portfolio: { ...s.portfolio, education: s.portfolio.education.filter(e => e.id !== id) },
        isDirty: true,
      })),

      addTestimonial: () => set(s => ({
        portfolio: { ...s.portfolio, testimonials: [...s.portfolio.testimonials, { id: Date.now().toString(), text: '', name: '', role: '', initials: '', color: '#c9a84c' }] },
        isDirty: true,
      })),
      updateTestimonial: (id, u) => set(s => ({
        portfolio: { ...s.portfolio, testimonials: s.portfolio.testimonials.map(t => t.id === id ? { ...t, ...u } : t) },
        isDirty: true,
      })),
      removeTestimonial: (id) => set(s => ({
        portfolio: { ...s.portfolio, testimonials: s.portfolio.testimonials.filter(t => t.id !== id) },
        isDirty: true,
      })),

      setSection: (s) => set({ currentSection: s }),
      setPreviewMode: (m) => set({ previewMode: m }),
      saveToLocal: () => set(s => ({ portfolio: { ...s.portfolio, lastSaved: new Date().toISOString() }, isDirty: false })),
      backupPortfolio: () => {
        if (typeof window === 'undefined') return
        const current = get().portfolio
        window.localStorage.setItem('portfolioforge-v2-backup', JSON.stringify(current))
      },
      restorePortfolio: () => {
        if (typeof window === 'undefined') return
        const raw = window.localStorage.getItem('portfolioforge-v2-backup')
        if (!raw) return
        try {
          const data = JSON.parse(raw)
          set({ portfolio: { ...emptyPortfolio, ...data }, isDirty: true })
          window.localStorage.removeItem('portfolioforge-v2-backup')
        } catch (err) {
          console.error('Failed to restore portfolio backup', err)
        }
      },
      resetPortfolio: () => set({ portfolio: emptyPortfolio, isDirty: false, selectedTemplate: '' }),

      loadTemplate: (templateKey: string) => {
        const tpl = TEMPLATES[templateKey]
        if (!tpl) return
        set(s => ({
          portfolio: {
            ...emptyPortfolio,
            ...tpl,
            theme: { ...emptyPortfolio.theme, ...(tpl.theme || {}) },
            lastSaved: new Date().toISOString(),
          },
          selectedTemplate: templateKey,
          isDirty: true,
        }))
      },
    }),
    { name: 'portfolioforge-v2', version: 2 }
  )
)

export { TEMPLATES }
