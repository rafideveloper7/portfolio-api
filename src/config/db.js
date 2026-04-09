import mongoose from 'mongoose'
import { env } from './env.js'

let isConnected = false

export async function connectToDatabase() {
  if (isConnected) {
    return mongoose.connection
  }

  if (!env.mongodbUri) {
    throw new Error('MONGODB_URI is not configured.')
  }

  const connection = await mongoose.connect(env.mongodbUri, {
    serverSelectionTimeoutMS: 10000,
  })

  isConnected = connection.connections[0].readyState === 1
  return mongoose.connection
}
