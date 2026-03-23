const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validate');
// const { authRateLimiter } = require('../middleware/rateLimiter');

router.post('/register', validate(schemas.register), authController.register);
router.post('/login', validate(schemas.login), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.getMe);

module.exports = router;
