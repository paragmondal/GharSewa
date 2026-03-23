const MongoBaseRepository = require('./MongoBaseRepository');
const Payment = require('../models/Payment');

class PaymentRepository extends MongoBaseRepository {
  constructor() {
    super(Payment);
  }

  async findByBooking(bookingId) {
    return this.findOne({ bookingId });
  }

  async findByRazorpayOrderId(orderId) {
    return this.findOne({ razorpayOrderId: orderId });
  }

  async markAsPaid(paymentId, razorpayPaymentId, razorpaySignature, method = 'other') {
    return this.update(paymentId, {
      status: 'paid',
      razorpayPaymentId,
      razorpaySignature,
      method,
    });
  }
}

module.exports = new PaymentRepository();
