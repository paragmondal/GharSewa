const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.post('/create-order', requireAuth, requireRole('user'), paymentController.createOrder);
router.post('/verify', requireAuth, paymentController.verifyPayment);
router.get('/booking/:bookingId', requireAuth, paymentController.getPaymentByBooking);

module.exports = router;
