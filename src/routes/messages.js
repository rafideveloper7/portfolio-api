import { Router } from 'express'
import { requireAdminAuth } from '../middleware/auth.js'
import { Message } from '../models/Message.js'

const router = Router()

router.get('/', requireAdminAuth, async (request, response) => {
  const messages = await Message.find().sort({ createdAt: -1 }).lean()
  return response.json({ messages })
})

router.patch('/:id', requireAdminAuth, async (request, response) => {
  const { status } = request.body || {}
  const message = await Message.findByIdAndUpdate(
    request.params.id,
    { $set: { status } },
    { new: true }
  )

  if (!message) {
    return response.status(404).json({ error: 'Message not found.' })
  }

  return response.json({ message })
})

export { router as messageRouter }
