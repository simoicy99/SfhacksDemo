import mongoose from "mongoose";

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Please set MONGODB_URI in .env");
  return uri;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached = global.mongoose ?? { conn: null, promise: null };
if (process.env.NODE_ENV !== "production") global.mongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(getMongoUri(), {
      serverSelectionTimeoutMS: 10000,
      family: 4, // use IPv4, can help if IPv6/DNS causes issues
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
