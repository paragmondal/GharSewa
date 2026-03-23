const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const adminOnly = [requireAuth, requireRole('admin')];

router.get('/dashboard', ...adminOnly, adminController.getDashboardStats);
router.get('/users', ...adminOnly, adminController.getAllUsers);
router.patch('/users/:userId/status', ...adminOnly, adminController.toggleUserStatus);
router.get('/providers', ...adminOnly, adminController.getAllProviders);
router.patch('/providers/:id/approve', ...adminOnly, adminController.approveProvider);
router.get('/bookings', ...adminOnly, adminController.getAllBookings);

module.exports = router;
