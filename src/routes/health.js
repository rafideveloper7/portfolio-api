import { Router } from 'express'

const router = Router()

router.get('/', (request, response) => {
  response.json({
    ok: true,
    service: 'portfolio-admin-backend',
  })
})

export { router as healthRouter }
