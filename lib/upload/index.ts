// lib/upload/index.ts — Local file system image storage
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'public/uploads'

// ─── Ensure upload directories exist ─────────────────────────
export function ensureUploadDirs() {
  const dirs = [
    path.join(process.cwd(), UPLOAD_DIR),
    path.join(process.cwd(), UPLOAD_DIR, 'profiles'),
    path.join(process.cwd(), UPLOAD_DIR, 'projects'),
  ]
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
      console.log('📁 Created upload dir:', dir)
    }
  })
}

// ─── Upload result interface ──────────────────────────────────
export interface UploadResult {
  url: string        // public URL e.g. /uploads/projects/abc.webp
  filename: string   // saved filename
  size: number       // file size in bytes
  width: number
  height: number
  mimetype: string
}

// ─── Save image buffer to disk ────────────────────────────────
export async function saveImage(
  buffer: Buffer,
  type: 'profile' | 'project' = 'project',
  originalName: string = 'image',
): Promise<UploadResult> {
  ensureUploadDirs()

  const ext      = 'webp'   // always convert to webp for best compression
  const filename = `${uuidv4()}.${ext}`
  const subdir   = type === 'profile' ? 'profiles' : 'projects'
  const savePath = path.join(process.cwd(), UPLOAD_DIR, subdir, filename)
  const publicUrl= `/uploads/${subdir}/${filename}`

  // Process with Sharp — resize, optimize, convert to WebP
  const maxWidth  = type === 'profile' ? 400 : 1200
  const maxHeight = type === 'profile' ? 400 : 900
  const quality   = 85

  const processed = await sharp(buffer)
    .resize(maxWidth, maxHeight, {
      fit: 'inside',          // maintain aspect ratio
      withoutEnlargement: true // don't upscale small images
    })
    .webp({ quality })
    .toBuffer()

  // Get dimensions
  const meta = await sharp(processed).metadata()

  // Write to disk
  fs.writeFileSync(savePath, processed)
  console.log(`✅ Image saved: ${savePath} (${Math.round(processed.length / 1024)}KB)`)

  return {
    url:      publicUrl,
    filename,
    size:     processed.length,
    width:    meta.width || 0,
    height:   meta.height || 0,
    mimetype: 'image/webp',
  }
}

// ─── Delete image from disk ───────────────────────────────────
export function deleteImage(filename: string, type: 'profile' | 'project' = 'project'): void {
  try {
    const subdir   = type === 'profile' ? 'profiles' : 'projects'
    const filePath = path.join(process.cwd(), UPLOAD_DIR, subdir, filename)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      console.log('🗑️ Image deleted:', filePath)
    }
  } catch (err) {
    console.error('Failed to delete image:', err)
  }
}

// ─── Delete multiple images ───────────────────────────────────
export function deleteImages(filenames: string[], type: 'profile' | 'project' = 'project'): void {
  filenames.forEach(f => deleteImage(f, type))
}

// ─── Get full disk path from URL ─────────────────────────────
export function urlToPath(url: string): string {
  // /uploads/projects/abc.webp → public/uploads/projects/abc.webp
  return path.join(process.cwd(), 'public', url)
}

// ─── Validate image file ──────────────────────────────────────
export function validateImage(file: File): string | null {
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB default

  if (!ALLOWED_TYPES.includes(file.type)) {
    return `File type not allowed. Use: JPG, PNG, WebP, GIF`
  }
  if (file.size > MAX_SIZE) {
    return `File too large. Maximum size is ${Math.round(MAX_SIZE / 1024 / 1024)}MB`
  }
  return null
}
