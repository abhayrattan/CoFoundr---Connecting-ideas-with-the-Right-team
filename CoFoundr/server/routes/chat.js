const express = require('express');
const router = express.Router();
const { getTeamMessages } = require('../controllers/chatController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/:teamId', requireAuth, getTeamMessages);

module.exports = router;
