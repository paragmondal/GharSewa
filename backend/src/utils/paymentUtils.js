const crypto = require('crypto');

/**
 * Generate a Razorpay payment signature for verification.
 */
const generateRazorpaySignature = (orderId, paymentId, secret) => {
  const body = `${orderId}|${paymentId}`;
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
};

/**
 * Verify Razorpay payment signature.
 */
const verifyRazorpaySignature = (orderId, paymentId, signature, secret) => {
  const expectedSignature = generateRazorpaySignature(orderId, paymentId, secret);
  return expectedSignature === signature;
};

module.exports = {
  generateRazorpaySignature,
  verifyRazorpaySignature,
};
