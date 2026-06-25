import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    avatar: { type: String },
    role: { type: String, default: 'Verified Buyer' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
