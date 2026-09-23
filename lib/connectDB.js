
import dns from "dns";
import mongoose from "mongoose";

// Use Google Public DNS for Node.js DNS lookups.
// This fixes MongoDB Atlas SRV resolution when Node is using
// a local resolver such as 127.0.0.1.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Reuse the connection across hot reloads in development and across
 * serverless invocations in production.
 *
 * Without this pattern, Next.js could open a new MongoDB connection
 * on every request.
 */
let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = {
    conn: null,
    promise: null,
  };
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

// Alias used by auth.js and any code following the connectDB()
// naming convention - same cached-connection function.
export const connectDB = connectToDatabase;
