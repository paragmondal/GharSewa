const paymentService = require('../services/PaymentService');
const { sendSuccess, sendCreated } = require('../utils/apiResponse');
const { getIO } = require('../config/socket');

const createOrder = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const order = await paymentService.createOrder(bookingId, req.user._id);
    return sendCreated(res, order, 'Payment order created');
  } catch (err) { next(err); }
};

const verifyPayment = async (req, res, next) => {
  try {
    const result = await paymentService.verifyPayment(req.body);

    // Real-time: notify booking update on payment
    const io = getIO();
    io.to(`user_${req.user._id}`).emit('paymentConfirmed', {
      paymentId: result.paymentId,
    });

    return sendSuccess(res, result, 'Payment verified successfully');
  } catch (err) { next(err); }
};

const getPaymentByBooking = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentByBooking(req.params.bookingId);
    return sendSuccess(res, { payment });
  } catch (err) { next(err); }
};

module.exports = { createOrder, verifyPayment, getPaymentByBooking };
