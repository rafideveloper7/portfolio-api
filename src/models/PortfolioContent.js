import mongoose from 'mongoose'

const portfolioContentSchema = new mongoose.Schema(
  {
    content: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export const PortfolioContent = mongoose.models.PortfolioContent || mongoose.model('PortfolioContent', portfolioContentSchema)
