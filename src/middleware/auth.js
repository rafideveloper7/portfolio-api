import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function requireAdminAuth(request, response, next) {
  const authHeader = request.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return response.status(401).json({ error: 'Authentication required.' })
  }

  try {
    const payload = jwt.verify(token, env.adminJwtSecret)
    request.admin = payload
    next()
  } catch (error) {
    return response.status(401).json({ error: 'Invalid or expired token.' })
  }
}
