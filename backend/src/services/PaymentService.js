const paymentRepository = require('../repositories/PaymentRepository');
const bookingRepository = require('../repositories/BookingRepository');
const { getRazorpay } = require('../config/razorpay');
const { verifyRazorpaySignature } = require('../utils/paymentUtils');
const config = require('../config');

class PaymentService {
  /**
   * Create a Razorpay order for a booking.
   */
  async createOrder(bookingId, userId) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      const err = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }
    if (booking.userId.toString() !== userId.toString()) {
      const err = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }
    if (booking.paymentStatus === 'paid') {
      const err = new Error('Booking is already paid');
      err.statusCode = 400;
      throw err;
    }

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: booking.amount * 100, // Razorpay expects paise
      currency: 'INR',
      receipt: `receipt_${bookingId}`,
      notes: { bookingId: bookingId.toString(), userId: userId.toString() },
    });

    // Record payment with order ID
    const payment = await paymentRepository.create({
      bookingId,
      userId,
      amount: booking.amount,
      razorpayOrderId: order.id,
      status: 'created',
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment._id,
      key: config.razorpay.keyId,
    };
  }

  /**
   * Verify Razorpay payment signature and mark payment as paid.
   */
  async verifyPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    const isValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      config.razorpay.keySecret
    );

    if (!isValid) {
      const err = new Error('Payment signature verification failed');
      err.statusCode = 400;
      throw err;
    }

    // Find payment record
    const payment = await paymentRepository.findByRazorpayOrderId(razorpayOrderId);
    if (!payment) {
      const err = new Error('Payment record not found');
      err.statusCode = 404;
      throw err;
    }

    // Mark payment as paid
    await paymentRepository.markAsPaid(payment._id, razorpayPaymentId, razorpaySignature);

    // Update booking payment status
    await bookingRepository.update(payment.bookingId, { paymentStatus: 'paid' });

    return { success: true, paymentId: razorpayPaymentId };
  }

  async getPaymentByBooking(bookingId) {
    return paymentRepository.findByBooking(bookingId);
  }
}

module.exports = new PaymentService();
