const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    // Which service categories this provider offers
    skills: [
      {
        type: String,
        enum: [
          'plumber',
          'electrician',
          'ac_mechanic',
          'gas_delivery',
          'cleaning',
          'carpenter',
          'painter',
        ],
      },
    ],
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    experience: {
      type: Number,
      min: 0,
      default: 0,
      comment: 'Years of experience',
    },
    pricing: {
      baseRate: {
        type: Number,
        required: [true, 'Base rate is required'],
        min: [0, 'Base rate cannot be negative'],
      },
      currency: {
        type: String,
        default: 'INR',
      },
    },
    availability: {
      isAvailable: {
        type: Boolean,
        default: true,
      },
      workingHours: {
        start: { type: String, default: '08:00' }, // HH:MM
        end: { type: String, default: '20:00' },
      },
      workingDays: {
        type: [String],
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      },
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedAt: Date,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    completedJobs: {
      type: Number,
      default: 0,
    },
    documents: {
      idProof: String,
      addressProof: String,
      certifications: [String],
    },
    serviceArea: {
      cities: [String],
      pincodes: [String],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ───────────────────────────────────────────────────
providerSchema.index({ skills: 1 });
providerSchema.index({ isApproved: 1 });
providerSchema.index({ 'availability.isAvailable': 1 });
providerSchema.index({ 'serviceArea.cities': 1 });
providerSchema.index({ 'rating.average': -1 });


const Provider = mongoose.model('Provider', providerSchema);
module.exports = Provider;
