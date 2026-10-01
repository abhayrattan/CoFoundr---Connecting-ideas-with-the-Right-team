const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

const { check } = require('express-validator');
const { validateRequest } = require('../middleware/validator');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // relaxed limit for development/testing
  message: { success: false, message: 'Too many requests from this IP, please try again later' }
});

router.post('/register', authLimiter, [
  check('name', 'Name is required').trim().not().isEmpty(),
  check('email', 'Please include a valid email').trim().isEmail().normalizeEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], validateRequest, register);

router.post('/login', authLimiter, [
  check('email', 'Please include a valid email').trim().isEmail().normalizeEmail(),
  check('password', 'Password is required').exists()
], validateRequest, login);
router.get('/me', requireAuth, me);

module.exports = router;
