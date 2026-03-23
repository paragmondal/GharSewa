const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    // Razorpay-specific fields
    razorpayOrderId: {
      type: String,
      unique: true,
      sparse: true, // allow multiple nulls
    },
    razorpayPaymentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    razorpaySignature: {
      type: String,
    },
    status: {
      type: String,
      enum: ['created', 'attempted', 'paid', 'failed', 'refunded'],
      default: 'created',
    },
    method: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet', 'emi', 'cod', 'other'],
      default: 'other',
    },
    failureReason: String,
    refundId: String,
    refundAmount: Number,
    refundedAt: Date,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ───────────────────────────────────────────────────
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
