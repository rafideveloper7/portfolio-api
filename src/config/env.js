import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envFilePath = path.resolve(__dirname, '../../.env')

dotenv.config({ path: envFilePath })

export const env = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  clientUrls: (process.env.CLIENT_URLS || '').split(',').map((value) => value.trim()).filter(Boolean),
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  adminJwtSecret: process.env.ADMIN_JWT_SECRET || 'replace-me',
  emailjsServiceId: process.env.EMAILJS_SERVICE_ID || '',
  emailjsTemplateId: process.env.EMAILJS_TEMPLATE_ID || '',
  emailjsPublicKey: process.env.EMAILJS_PUBLIC_KEY || '',
  emailjsPrivateKey: process.env.EMAILJS_PRIVATE_KEY || '',
  contactToEmail: process.env.CONTACT_TO_EMAIL || '',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  telegramChatId: process.env.TELEGRAM_CHAT_ID || '',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
  cloudinaryUploadFolder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'portfolio-admin',
}
