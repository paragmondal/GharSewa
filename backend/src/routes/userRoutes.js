const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.get('/profile', requireAuth, userController.getProfile);
router.put('/profile', requireAuth, userController.updateProfile);

// Admin only
router.get('/', requireAuth, requireRole('admin'), userController.getAllUsers);
router.patch('/:userId/status', requireAuth, requireRole('admin'), userController.toggleUserStatus);

module.exports = router;
