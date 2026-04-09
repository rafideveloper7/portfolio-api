import { Router } from 'express'
import { PortfolioContent } from '../models/PortfolioContent.js'
import { requireAdminAuth } from '../middleware/auth.js'
import { defaultPortfolioContent } from '../lib/defaultContent.js'

const router = Router()

async function getContentDocument() {
  let document = await PortfolioContent.findOne().sort({ createdAt: 1 })

  if (!document) {
    document = await PortfolioContent.create({
      content: defaultPortfolioContent,
    })
  }

  return document
}

router.get('/public', async (request, response) => {
  const document = await getContentDocument()
  return response.json({ content: document.content })
})

router.get('/', requireAdminAuth, async (request, response) => {
  const document = await getContentDocument()
  return response.json({ content: document.content, updatedAt: document.updatedAt })
})

router.put('/', requireAdminAuth, async (request, response) => {
  const { content } = request.body || {}

  if (!content || typeof content !== 'object') {
    return response.status(400).json({ error: 'A content object is required.' })
  }

  const document = await getContentDocument()
  document.content = content
  await document.save()

  return response.json({
    success: true,
    content: document.content,
    updatedAt: document.updatedAt,
  })
})

export { router as contentRouter }
