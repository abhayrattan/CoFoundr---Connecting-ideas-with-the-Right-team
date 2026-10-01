const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { createReview, getUserReviews } = require('../controllers/reviewController');

router.post('/', requireAuth, createReview);
router.get('/user/:userId', requireAuth, getUserReviews);

module.exports = router;
