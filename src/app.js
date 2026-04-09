import cors from 'cors'
import express from 'express'
import { connectToDatabase } from './config/db.js'
import { env } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { authRouter } from './routes/auth.js'
import { contactRouter } from './routes/contact.js'
import { contentRouter } from './routes/content.js'
import { healthRouter } from './routes/health.js'
import { mediaRouter } from './routes/media.js'
import { messageRouter } from './routes/messages.js'

export const app = express()

const allowedOrigins = Array.from(new Set([
  env.frontendUrl,
  ...env.clientUrls,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
].filter(Boolean)))

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }

    callback(new Error('Origin not allowed by CORS'))
  },
  credentials: false,
}))
app.use(express.json({ limit: '10mb' }))

app.use(async (request, response, next) => {
  try {
    await connectToDatabase()
    next()
  } catch (error) {
    next(error)
  }
})

app.use('/api/health', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/contact', contactRouter)
app.use('/api/content', contentRouter)
app.use('/api/messages', messageRouter)
app.use('/api/media', mediaRouter)

app.use(errorHandler)
