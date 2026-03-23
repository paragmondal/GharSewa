const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/chat', requireAuth, aiController.chat);

module.exports = router;
