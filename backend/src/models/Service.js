const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['plumber', 'electrician', 'ac_mechanic', 'gas_delivery', 'cleaning', 'carpenter', 'painter'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    shortDescription: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Base price cannot be negative'],
    },
    priceUnit: {
      type: String,
      default: 'per visit',
      enum: ['per visit', 'per hour', 'per day', 'fixed', 'per delivery'],
    },
    icon: {
      type: String,
      default: '🔧',
    },
    image: String,
    features: [String],
    estimatedDuration: {
      type: String,
      default: '1-2 hours',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    popularityScore: {
      type: Number,
      default: 0,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// ─── Auto-generate slug ────────────────────────────────────────
serviceSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  next();
});

// ─── Indexes ───────────────────────────────────────────────────
serviceSchema.index({ category: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ popularityScore: -1 });


const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
