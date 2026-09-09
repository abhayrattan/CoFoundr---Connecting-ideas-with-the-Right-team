const express = require('express');
const router = express.Router();
const { createStartup, getStartups, getStartupById, updateStartup, deleteStartup, bookmarkStartup, unbookmarkStartup, getSavedStartups } = require('../controllers/startupController');
const { getStartupRequests } = require('../controllers/joinRequestController');
const { getTeamByStartup } = require('../controllers/teamController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/bookmarked', requireAuth, getSavedStartups);

router.route('/')
  .post(requireAuth, createStartup)
  .get(getStartups);

router.route('/:id')
  .get(getStartupById)
  .put(requireAuth, updateStartup)
  .delete(requireAuth, deleteStartup);

router.route('/:id/bookmark')
  .post(requireAuth, bookmarkStartup)
  .delete(requireAuth, unbookmarkStartup);

router.get('/:startupId/join-requests', requireAuth, getStartupRequests);
router.get('/:startupId/team', getTeamByStartup);

module.exports = router;
