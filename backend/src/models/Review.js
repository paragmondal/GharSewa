const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true, // one review per booking
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    tags: {
      type: [String],
      enum: ['on_time', 'professional', 'quality_work', 'good_communication', 'fair_pricing'],
    },
    providerReply: {
      type: String,
      maxlength: [500, 'Reply cannot exceed 500 characters'],
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ───────────────────────────────────────────────────
reviewSchema.index({ providerId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ serviceId: 1 });
reviewSchema.index({ rating: 1 });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
