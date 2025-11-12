// lib/mongodb.ts
import { MongoClient, type Db } from "mongodb"

// Force Node.js runtime to avoid Edge Runtime issues with MongoDB
export const runtime = 'nodejs'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB_NAME

const options = {
  compressors: ['none' as const], // Disable compression to avoid snappy issues
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  retryReads: true,
  // Add connection monitoring
  heartbeatFrequencyMS: 10000,
  serverMonitoringMode: 'auto' as const,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!uri) {
  clientPromise = Promise.reject(new Error('Invalid/Missing environment variable: "MONGODB_URI"'))
} else if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise

  if (!dbName) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_DB_NAME"')
  }

  return client.db(dbName)
}

export default clientPromise