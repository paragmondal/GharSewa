const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validate');

router.post('/', requireAuth, requireRole('user'), validate(schemas.review), reviewController.createReview);
router.get('/provider/:providerId', reviewController.getProviderReviews);

module.exports = router;
