const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validate');

// User
router.post('/', requireAuth, requireRole('user'), validate(schemas.booking), bookingController.createBooking);
router.get('/my', requireAuth, bookingController.getMyBookings);
router.delete('/:id/cancel', requireAuth, bookingController.cancelBooking);

// Provider
router.get('/provider', requireAuth, requireRole('provider'), bookingController.getProviderBookings);

// Shared (user + provider + admin)
router.get('/:id', requireAuth, bookingController.getBookingById);
router.patch('/:id/status', requireAuth, requireRole('provider', 'admin'), bookingController.updateBookingStatus);

// Admin
router.get('/', requireAuth, requireRole('admin'), bookingController.getAllBookings);

module.exports = router;
