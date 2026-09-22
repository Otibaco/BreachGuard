import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Reuse the connection across hot reloads in development and across
 * serverless invocations in production. Without this pattern, Next.js
 * would open a new MongoDB connection on every request.
 */
let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local before starting the server."
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export default connectToDatabase;

// Alias used by auth.js and any code following the connectDB() naming
// convention - same cached-connection function, just a second name.
export const connectDB = connectToDatabase;
