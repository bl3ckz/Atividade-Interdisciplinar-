// lib/db.ts
// Mongoose connection helper with global cache to avoid multiple connections in Next.js dev

import mongoose, { ConnectOptions } from 'mongoose';

// Augment global type to hold cached connection/promise
declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Access env via globalThis to avoid TS complaining when @types/node isn't present yet
const MONGODB_URI: string | undefined = (globalThis as any)?.process?.env?.MONGODB_URI;

if (!MONGODB_URI) {
  // Throw early with a clear message if env is missing
  throw new Error(
    'Missing MONGODB_URI. Define it in your .env.local (never commit secrets).'
  );
}

let cached: MongooseCache = (globalThis as any)._mongoose || { conn: null, promise: null };
if (!(globalThis as any)._mongoose) (globalThis as any)._mongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    // Reuse existing connection
    return cached.conn;
  }

  if (!cached.promise) {
    try {
      const opts: ConnectOptions = {
        // Buffering set to false so operations fail fast if not connected
        bufferCommands: false,
        // Fail fast during cold start
        serverSelectionTimeoutMS: 30000,
        // App name for Atlas connection visibility
        appName: 'Multidisciplinar',
      } as ConnectOptions;

      cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((m) => {
        const nodeEnv = (globalThis as any)?.process?.env?.NODE_ENV;
        if (nodeEnv !== 'test') {
          // Lightweight log when the connection is first established
          console.log('MongoDB connected');
        }
        return m;
      });
    } catch (err) {
      console.error('Error initializing MongoDB connection');
      throw err;
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    console.error('MongoDB connection failed');
    throw err; // Rethrow without leaking secrets
  }

  return cached.conn;
}

export default connectDB;
