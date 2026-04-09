import { Router } from 'express'
import multer from 'multer'
import { cloudinary } from '../config/cloudinary.js'
import { requireAdminAuth } from '../middleware/auth.js'
import { env } from '../config/env.js'
import { MediaAsset } from '../models/MediaAsset.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.get('/', requireAdminAuth, async (request, response) => {
  const assets = await MediaAsset.find().sort({ createdAt: -1 }).lean()
  return response.json({ assets })
})

router.post('/upload', requireAdminAuth, upload.single('file'), async (request, response) => {
  if (!request.file) {
    return response.status(400).json({ error: 'No file uploaded.' })
  }

  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    return response.status(500).json({ error: 'Cloudinary is not configured.' })
  }

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: env.cloudinaryUploadFolder,
        resource_type: 'auto',
      },
      (error, uploadResult) => {
        if (error) {
          reject(error)
          return
        }

        resolve(uploadResult)
      }
    )

    stream.end(request.file.buffer)
  })

  const asset = await MediaAsset.create({
    publicId: result.public_id,
    url: result.url,
    secureUrl: result.secure_url,
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    folder: result.folder,
    originalFilename: request.file.originalname,
  })

  return response.json({ asset })
})

export { router as mediaRouter }
