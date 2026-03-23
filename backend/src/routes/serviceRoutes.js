const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validate');

// Public
router.get('/', serviceController.getAllServices);
router.get('/category/:category', serviceController.getServicesByCategory);
router.get('/:id', serviceController.getServiceById);

// Admin only
router.post('/', requireAuth, requireRole('admin'), validate(schemas.service), serviceController.createService);
router.put('/:id', requireAuth, requireRole('admin'), serviceController.updateService);
router.delete('/:id', requireAuth, requireRole('admin'), serviceController.deleteService);

module.exports = router;
