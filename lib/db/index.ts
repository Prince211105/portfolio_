// lib/db/index.ts — MongoDB connection via Mongoose
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined in .env.local')
}

// Global cache to prevent multiple connections in dev (hot reload)
let cached = (global as any).mongoose as {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
    })
  }

  cached.conn = await cached.promise
  console.log('✅ MongoDB connected:', MONGODB_URI.split('@').pop() || 'localhost')
  return cached.conn
}

export default connectDB
