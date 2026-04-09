import mongoose from 'mongoose'

const mediaAssetSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    format: { type: String, default: '' },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    bytes: { type: Number, default: 0 },
    folder: { type: String, default: '' },
    originalFilename: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
)

export const MediaAsset = mongoose.models.MediaAsset || mongoose.model('MediaAsset', mediaAssetSchema)
