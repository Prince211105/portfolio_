# 🚀 PortfolioForge — Complete Setup Guide

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Database | **MongoDB + Mongoose** |
| Images | **Local Storage** (public/uploads/) |
| Auth | NextAuth.js (Email + Google + GitHub) |
| AI | Anthropic Claude API |
| Email | Nodemailer (Gmail SMTP) |
| State | Zustand (localStorage persist) |

---

## 📁 Project Structure

```
portfolioforge/
├── app/
│   ├── page.tsx                    ← Main router (7 pages)
│   ├── layout.tsx                  ← Root layout
│   ├── globals.css                 ← Tailwind design system
│   └── api/
│       ├── auth/[...nextauth]/     ← Login / logout
│       ├── auth/register/          ← Register new user
│       ├── portfolios/             ← List + create portfolios
│       ├── portfolios/[id]/        ← Get + update + delete
│       ├── projects/               ← CRUD projects
│       ├── upload/                 ← LOCAL image upload (Sharp)
│       ├── ai/                     ← Anthropic Claude AI
│       ├── contact/                ← Contact form + email
│       └── export/                 ← Export history log
│
├── components/
│   ├── landing/LandingPage.tsx     ← Full landing page
│   ├── layout/
│   │   ├── Navbar.tsx              ← Responsive navbar
│   │   └── DashboardPage.tsx       ← Dashboard
│   ├── builder/
│   │   ├── BuilderPage.tsx         ← Builder + sidebar
│   │   ├── AiModePage.tsx          ← AI prompt mode
│   │   ├── ExportPage.tsx          ← Export + HTML download
│   │   ├── TemplateSelectPage.tsx  ← 6 unique templates
│   │   └── sections/              ← 10 builder sections
│   │       ├── ProfileSection.tsx
│   │       ├── SkillsSection.tsx
│   │       ├── ServicesSection.tsx
│   │       ├── ProjectsSection.tsx ← Multi-image upload
│   │       ├── ExperienceSection.tsx
│   │       ├── EducationSection.tsx
│   │       ├── TestimonialsSection.tsx
│   │       ├── AchievementsSection.tsx
│   │       ├── DesignSection.tsx
│   │       └── SectionsPanel.tsx
│   ├── preview/PreviewPage.tsx     ← Live preview + modal
│   └── ui/
│       ├── ImageCarousel.tsx       ← Carousel + lightbox
│       └── ProjectDetailModal.tsx  ← Full project detail
│
├── lib/
│   ├── db/index.ts                 ← MongoDB connection
│   ├── db/models.ts                ← All Mongoose models
│   ├── auth/index.ts               ← NextAuth config
│   ├── upload/index.ts             ← Local file storage + Sharp
│   ├── ai/index.ts                 ← Anthropic Claude
│   ├── email/index.ts              ← Nodemailer
│   └── utils.ts                   ← HTML export generator
│
├── store/index.ts                  ← Zustand global state
├── types/index.ts                  ← TypeScript types
├── scripts/seed.ts                 ← Demo data seeder
├── public/uploads/
│   ├── profiles/                   ← Profile photos (local)
│   └── projects/                   ← Project images (local)
└── .env.example                    ← Environment template
```

---

## ⚡ Step 1 — Install

```bash
cd portfolioforge
npm install
```

---

## 🔑 Step 2 — Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

### ① MongoDB — REQUIRED

**Option A: Local (Free, no signup)**
```env
MONGODB_URI="mongodb://localhost:27017/portfolioforge"
```
Install MongoDB locally:
- Windows: https://www.mongodb.com/try/download/community
- Mac: `brew install mongodb-community && brew services start mongodb-community`
- Ubuntu: `sudo apt install -y mongodb && sudo systemctl start mongodb`

**Option B: MongoDB Atlas (Free cloud, 512MB)**
```env
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/portfolioforge"
```
Sign up free: https://cloud.mongodb.com

---

### ② NextAuth Secret — REQUIRED

```env
NEXTAUTH_SECRET="your-random-secret-at-least-32-characters"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secret:
```bash
openssl rand -base64 32
```

---

### ③ Anthropic AI — Optional (for AI suggestions)

```env
ANTHROPIC_API_KEY="sk-ant-..."
```

Get API key: https://console.anthropic.com

> Without this key, the AI suggestions panel shows fallback tips. The rest of the app works fully.

---

### ④ Gmail Email — Optional (for contact form emails)

```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your@gmail.com"
EMAIL_PASS="xxxx xxxx xxxx xxxx"
EMAIL_FROM="PortfolioForge <your@gmail.com>"
```

Get Gmail App Password:
Gmail → Settings → Security → 2-Step Verification → App Passwords → Create

---

### ⑤ Google OAuth — Optional

```env
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"
```

Setup: https://console.cloud.google.com
→ APIs & Services → OAuth 2.0 → Authorised redirect URIs:
`http://localhost:3000/api/auth/callback/google`

---

### ⑥ GitHub OAuth — Optional

```env
GITHUB_CLIENT_ID="xxx"
GITHUB_CLIENT_SECRET="xxx"
```

Setup: GitHub → Settings → Developer settings → OAuth Apps
→ Callback URL: `http://localhost:3000/api/auth/callback/github`

---

## 🌱 Step 3 — Demo Data (Optional)

```bash
npm run seed
```

This creates:
- 1 demo user
- 1 complete portfolio (Alexandra Rivera)
- 3 projects with highlights
- 3 experience entries
- 1 education entry
- 2 testimonials

**Demo login:**
- Email: `demo@portfolioforge.app`
- Password: `demo1234`

---

## 🏃 Step 4 — Start

```bash
npm run dev
```

Open: **http://localhost:3000**

---

## 📸 How Local Image Storage Works

Images are saved to `public/uploads/` on your server:

```
public/uploads/
├── profiles/    ← Profile photos  (max 400×400, WebP)
└── projects/    ← Project images  (max 1200×900, WebP)
```

- Uploaded via `/api/upload` route
- **Sharp** converts all images to WebP and optimises them
- Accessible via URL: `/uploads/projects/filename.webp`
- Included in the exported HTML via base64 (if uploaded in builder)

---

## 🚀 Deploy to Production

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Add all env variables in Vercel Dashboard → Settings → Environment Variables.

⚠️ **Important**: Vercel is serverless — local file storage won't persist between deployments.
For production, replace `lib/upload/index.ts` with Cloudinary (free tier: 25GB).

### VPS / DigitalOcean (Local storage works here)

```bash
npm run build
npm start
# or with PM2:
pm2 start npm --name "portfolioforge" -- start
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📊 MongoDB Collections

| Collection | Data |
|-----------|------|
| `users` | Email, hashed password, plan |
| `portfolios` | Full portfolio data |
| `projects` | Projects + embedded images array |
| `experiences` | Work history |
| `educations` | Degrees |
| `testimonials` | Client reviews |
| `contactmessages` | Contact form submissions |
| `exporthistories` | Export records |

---

## ✅ Complete Feature List

| Feature | Works |
|---------|-------|
| Landing page (Hero, Features, Steps, FAQ) | ✅ |
| 6 Unique templates with visual preview | ✅ |
| Dashboard | ✅ |
| Builder — 10 sections | ✅ |
| Multi-image upload per project (base64) | ✅ |
| Image carousel + fullscreen lightbox | ✅ |
| Project detail modal (click on card) | ✅ |
| AI prompt mode (Anthropic Claude) | ✅ |
| Live preview (Desktop / Tablet / Mobile) | ✅ |
| HTML export — working download | ✅ |
| Copy source code to clipboard | ✅ |
| MongoDB database | ✅ |
| User registration + login | ✅ |
| Google + GitHub OAuth | ✅ |
| Local image storage (Sharp optimised) | ✅ |
| Contact form + email notification | ✅ |
| Export history tracking | ✅ |
| Zustand state (survives page refresh) | ✅ |
| TypeScript throughout | ✅ |
| Responsive design | ✅ |
| Dark/Light/Bold/Tech/Warm themes | ✅ |
| SEO metadata fields | ✅ |
| Google Analytics integration | ✅ |

---

## 🛠 Useful Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production
npm run seed         # Add demo data to MongoDB
npm run lint         # Lint check
```

---

## 🆓 Free Services Summary

| Service | Free Tier | Use |
|---------|-----------|-----|
| MongoDB Atlas | 512MB | Database |
| Vercel | Unlimited deploys | Hosting |
| Anthropic | Pay-per-use ~$0.01/req | AI |
| Gmail SMTP | Free | Email |

---

Built with ♥ — PortfolioForge
