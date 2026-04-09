import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

const router = Router()

router.post('/login', async (request, response) => {
  const { email, password } = request.body || {}

  if (!email || !password) {
    return response.status(400).json({ error: 'Email and password are required.' })
  }

  if (email !== env.adminEmail || password !== env.adminPassword) {
    return response.status(401).json({ error: 'Invalid credentials.' })
  }

  const token = jwt.sign(
    {
      email,
      role: 'admin',
    },
    env.adminJwtSecret,
    { expiresIn: '7d' }
  )

  return response.json({
    token,
    admin: {
      email,
      role: 'admin',
    },
  })
})

export { router as authRouter }
