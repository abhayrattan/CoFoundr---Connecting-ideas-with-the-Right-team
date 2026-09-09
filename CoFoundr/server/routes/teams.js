const express = require('express');
const router = express.Router();
const { getTeamById, assignRole, getMyTeams } = require('../controllers/teamController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/my', requireAuth, getMyTeams);
router.get('/:teamId', getTeamById);
router.put('/:teamId/roles', requireAuth, assignRole);

module.exports = router;
