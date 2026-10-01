const express = require('express');
const router = express.Router();
const { createStartup, getStartups, getStartupById, updateStartup, deleteStartup, bookmarkStartup, unbookmarkStartup, getSavedStartups } = require('../controllers/startupController');
const { getStartupRequests } = require('../controllers/joinRequestController');
const { getTeamByStartup } = require('../controllers/teamController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/bookmarked', requireAuth, getSavedStartups);

const { check } = require('express-validator');
const { validateRequest } = require('../middleware/validator');

router.route('/')
  .post(
    requireAuth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('domain', 'Domain is required').not().isEmpty(),
      check('teamSize', 'Team size must be a number').isNumeric()
    ],
    validateRequest,
    createStartup
  )
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
