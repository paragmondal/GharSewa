const Razorpay = require('razorpay');
const config = require('./index');

let razorpayInstance = null;

const getRazorpay = () => {
  if (!razorpayInstance) {
    if (!config.razorpay.keyId || !config.razorpay.keySecret) {
      throw new Error('Razorpay credentials not configured');
    }
    razorpayInstance = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });
  }
  return razorpayInstance;
};

module.exports = { getRazorpay };
