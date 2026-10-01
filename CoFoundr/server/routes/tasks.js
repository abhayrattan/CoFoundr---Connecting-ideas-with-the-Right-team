const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');
const { requireAuth } = require('../middleware/authMiddleware');

const { check } = require('express-validator');
const { validateRequest } = require('../middleware/validator');

router.route('/')
  .post(
    requireAuth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('teamId', 'Team ID is required').not().isEmpty(),
      check('startupId', 'Startup ID is required').not().isEmpty()
    ],
    validateRequest,
    createTask
  )
  .get(requireAuth, getTasks);

router.route('/:id')
  .get(requireAuth, getTaskById)
  .put(requireAuth, updateTask)
  .delete(requireAuth, deleteTask);

module.exports = router;
