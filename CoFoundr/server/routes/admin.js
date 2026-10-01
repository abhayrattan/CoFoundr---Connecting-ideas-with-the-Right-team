const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const { getStats, getUsers, updateUserRole, deactivateUser } = require('../controllers/adminController');

// Apply auth middleware to all routes in this file
router.use(requireAuth);
router.use(requireRole('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deactivateUser);

module.exports = router;
