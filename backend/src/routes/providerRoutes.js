const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// Public search
router.get('/search', providerController.searchProviders);
router.get('/:id', providerController.getProviderById);

// Provider self-management
router.post('/profile', requireAuth, providerController.createProfile);
router.get('/profile/me', requireAuth, providerController.getMyProfile);
router.put('/profile', requireAuth, providerController.updateProfile);
router.patch('/availability', requireAuth, providerController.toggleAvailability);

// Admin
router.get('/', requireAuth, requireRole('admin'), providerController.getAllProviders);
router.patch('/:id/approve', requireAuth, requireRole('admin'), providerController.approveProvider);

module.exports = router;
