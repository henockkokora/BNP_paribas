import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bnp-paribas'

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env')
}

// Add a type-safe global cache for mongoose connection
interface MongooseGlobal {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Use a symbol to avoid name collisions on globalThis
const globalWithMongoose = global as typeof globalThis & {
  _mongoose?: MongooseGlobal
}

let cached: MongooseGlobal = globalWithMongoose._mongoose || { conn: null, promise: null }

if (!globalWithMongoose._mongoose) {
  globalWithMongoose._mongoose = cached
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
