// lib/db/models.ts — All Mongoose Models
import mongoose, { Schema, Document, Model } from 'mongoose'

// ─── Interfaces ──────────────────────────────────────────────

export interface IProjectImage {
  _id: string
  url: string          // e.g. /uploads/projects/filename.jpg
  filename: string     // saved filename
  caption: string
  alt: string
  order: number
  size: number         // bytes
  mimetype: string
  createdAt: Date
}

export interface IProject {
  _id: string
  portfolioId: string
  order: number
  name: string
  stack: string
  desc: string
  longDesc: string
  icon: string
  category: string
  year: string
  role: string
  liveUrl: string
  githubUrl: string
  featured: boolean
  highlights: string[]
  images: IProjectImage[]
  createdAt: Date
  updatedAt: Date
}

export interface IExperience {
  _id: string
  portfolioId: string
  order: number
  title: string
  company: string
  period: string
  desc: string
  current: boolean
}

export interface IEducation {
  _id: string
  portfolioId: string
  order: number
  degree: string
  school: string
  year: string
  desc: string
}

export interface ITestimonial {
  _id: string
  portfolioId: string
  order: number
  text: string
  name: string
  role: string
  initials: string
  color: string
}

export interface IPortfolio {
  _id: string
  userId: string
  slug: string
  published: boolean
  name: string
  role: string
  headline: string
  about: string
  email: string
  location: string
  phone: string
  social: {
    linkedin: string
    github: string
    twitter: string
    website: string
    dribbble: string
    youtube: string
  }
  skills: string[]
  tools: string[]
  services: string[]
  achievements: string[]
  certifications: string[]
  theme: {
    style: string
    accent: string
    font: string
    layout: string
    tone: string
    animation: string
  }
  sections: {
    hero: boolean
    about: boolean
    skills: boolean
    projects: boolean
    experience: boolean
    education: boolean
    services: boolean
    testimonials: boolean
    achievements: boolean
    contact: boolean
  }
  seoTitle: string
  seoDesc: string
  seoImage: string
  analytics: string
  profilePhoto: string  // local path e.g. /uploads/profiles/xxx.jpg
  createdAt: Date
  updatedAt: Date
}

export interface IUser {
  _id: string
  email: string
  name: string
  password: string
  image: string
  plan: 'FREE' | 'PRO' | 'AGENCY'
  emailVerified: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface IContactMessage {
  _id: string
  portfolioId: string
  senderName: string
  senderEmail: string
  message: string
  read: boolean
  createdAt: Date
}

export interface IExportHistory {
  _id: string
  userId: string
  portfolioId: string
  format: 'HTML' | 'REACT' | 'ZIP'
  createdAt: Date
}

// ─── Schemas ─────────────────────────────────────────────────

// Project Image (embedded in Project)
const ProjectImageSchema = new Schema<IProjectImage>({
  url:       { type: String, required: true },
  filename:  { type: String, required: true },
  caption:   { type: String, default: '' },
  alt:       { type: String, default: '' },
  order:     { type: Number, default: 0 },
  size:      { type: Number, default: 0 },
  mimetype:  { type: String, default: 'image/jpeg' },
  createdAt: { type: Date,   default: Date.now },
})

// Project
const ProjectSchema = new Schema<IProject>({
  portfolioId: { type: String, required: true, index: true },
  order:       { type: Number, default: 0 },
  name:        { type: String, required: true },
  stack:       { type: String, default: '' },
  desc:        { type: String, default: '' },
  longDesc:    { type: String, default: '' },
  icon:        { type: String, default: '💡' },
  category:    { type: String, default: 'Web Application' },
  year:        { type: String, default: '' },
  role:        { type: String, default: '' },
  liveUrl:     { type: String, default: '' },
  githubUrl:   { type: String, default: '' },
  featured:    { type: Boolean, default: false },
  highlights:  [{ type: String }],
  images:      [ProjectImageSchema],
}, { timestamps: true })

// Experience (embedded in Portfolio)
const ExperienceSchema = new Schema<IExperience>({
  portfolioId: { type: String, required: true },
  order:   { type: Number, default: 0 },
  title:   { type: String, required: true },
  company: { type: String, required: true },
  period:  { type: String, required: true },
  desc:    { type: String, default: '' },
  current: { type: Boolean, default: false },
})

// Education
const EducationSchema = new Schema<IEducation>({
  portfolioId: { type: String, required: true },
  order:  { type: Number, default: 0 },
  degree: { type: String, required: true },
  school: { type: String, required: true },
  year:   { type: String, required: true },
  desc:   { type: String, default: '' },
})

// Testimonial
const TestimonialSchema = new Schema<ITestimonial>({
  portfolioId: { type: String, required: true },
  order:    { type: Number, default: 0 },
  text:     { type: String, required: true },
  name:     { type: String, required: true },
  role:     { type: String, required: true },
  initials: { type: String, default: '' },
  color:    { type: String, default: '#c9a84c' },
})

// Portfolio
const PortfolioSchema = new Schema<IPortfolio>({
  userId:    { type: String, required: true, index: true },
  slug:      { type: String, required: true, unique: true },
  published: { type: Boolean, default: false },

  name:      { type: String, required: true },
  role:      { type: String, default: '' },
  headline:  { type: String, default: '' },
  about:     { type: String, default: '' },
  email:     { type: String, default: '' },
  location:  { type: String, default: '' },
  phone:     { type: String, default: '' },

  social: {
    linkedin: { type: String, default: '' },
    github:   { type: String, default: '' },
    twitter:  { type: String, default: '' },
    website:  { type: String, default: '' },
    dribbble: { type: String, default: '' },
    youtube:  { type: String, default: '' },
  },

  skills:         [{ type: String }],
  tools:          [{ type: String }],
  services:       [{ type: String }],
  achievements:   [{ type: String }],
  certifications: [{ type: String }],

  theme: {
    style:     { type: String, default: 'dark-luxury' },
    accent:    { type: String, default: 'gold' },
    font:      { type: String, default: 'playfair' },
    layout:    { type: String, default: 'centered' },
    tone:      { type: String, default: 'professional' },
    animation: { type: String, default: 'subtle' },
  },

  sections: {
    hero:         { type: Boolean, default: true },
    about:        { type: Boolean, default: true },
    skills:       { type: Boolean, default: true },
    projects:     { type: Boolean, default: true },
    experience:   { type: Boolean, default: true },
    education:    { type: Boolean, default: true },
    services:     { type: Boolean, default: true },
    testimonials: { type: Boolean, default: true },
    achievements: { type: Boolean, default: true },
    contact:      { type: Boolean, default: true },
  },

  seoTitle:     { type: String, default: '' },
  seoDesc:      { type: String, default: '' },
  seoImage:     { type: String, default: '' },
  analytics:    { type: String, default: '' },
  profilePhoto: { type: String, default: '' },
}, { timestamps: true })

// User
const UserSchema = new Schema<IUser>({
  email:         { type: String, required: true, unique: true, lowercase: true },
  name:          { type: String, default: '' },
  password:      { type: String, default: '' },
  image:         { type: String, default: '' },
  plan:          { type: String, enum: ['FREE','PRO','AGENCY'], default: 'FREE' },
  emailVerified: { type: Date, default: null },
}, { timestamps: true })

// Contact Message
const ContactMessageSchema = new Schema<IContactMessage>({
  portfolioId:  { type: String, required: true, index: true },
  senderName:   { type: String, required: true },
  senderEmail:  { type: String, required: true },
  message:      { type: String, required: true },
  read:         { type: Boolean, default: false },
  createdAt:    { type: Date, default: Date.now },
})

// Export History
const ExportHistorySchema = new Schema<IExportHistory>({
  userId:      { type: String, required: true, index: true },
  portfolioId: { type: String, required: true },
  format:      { type: String, enum: ['HTML','REACT','ZIP'], required: true },
  createdAt:   { type: Date, default: Date.now },
})

// ─── Model exports (singleton pattern) ───────────────────────
function getModel<T>(name: string, schema: Schema): Model<T> {
  return (mongoose.models[name] || mongoose.model<T>(name, schema)) as Model<T>
}

export const User          = getModel<IUser>         ('User',          UserSchema)
export const Portfolio     = getModel<IPortfolio>    ('Portfolio',     PortfolioSchema)
export const Project       = getModel<IProject>      ('Project',       ProjectSchema)
export const Experience    = getModel<IExperience>   ('Experience',    ExperienceSchema)
export const Education     = getModel<IEducation>    ('Education',     EducationSchema)
export const Testimonial   = getModel<ITestimonial>  ('Testimonial',   TestimonialSchema)
export const ContactMessage= getModel<IContactMessage>('ContactMessage',ContactMessageSchema)
export const ExportHistory = getModel<IExportHistory>('ExportHistory', ExportHistorySchema)
