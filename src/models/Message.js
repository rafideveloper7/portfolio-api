import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    subject: { type: String, default: 'New Contact Form Submission', trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['new', 'read', 'archived'], default: 'new' },
    emailStatus: { type: String, enum: ['pending', 'sent', 'failed', 'skipped'], default: 'pending' },
    telegramStatus: { type: String, enum: ['pending', 'sent', 'failed', 'skipped'], default: 'pending' },
    emailError: { type: String, default: '' },
    telegramError: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
)

export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema)
