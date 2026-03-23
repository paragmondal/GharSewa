const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      default: null,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Scheduled date is required'],
    },
    scheduledTime: {
      type: String,
      required: [true, 'Scheduled time is required'],
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    status: {
      type: String,
      enum: [
        'pending',      // waiting for provider assignment
        'confirmed',    // provider accepted
        'in_progress',  // service ongoing
        'completed',    // service done
        'cancelled',    // cancelled by user or provider
        'rejected',     // provider rejected
      ],
      default: 'pending',
    },
    statusHistory: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        note: String,
      },
    ],
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending',
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    cancellationReason: String,
    completedAt: Date,
    isReviewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Auto-generate booking number ─────────────────────────────
bookingSchema.pre('save', async function (next) {
  if (this.isNew && !this.bookingNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingNumber = `GS-${timestamp}-${random}`;
  }
  // Track status history
  if (this.isModified('status')) {
    this.statusHistory.push({ status: this.status, changedAt: new Date() });
  }
  next();
});

// ─── Indexes ───────────────────────────────────────────────────
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ providerId: 1, status: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ scheduledDate: 1 });
bookingSchema.index({ paymentStatus: 1 });


const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
