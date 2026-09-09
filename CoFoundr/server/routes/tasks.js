const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');
const { requireAuth } = require('../middleware/authMiddleware');

router.route('/')
  .post(requireAuth, createTask)
  .get(requireAuth, getTasks);

router.route('/:id')
  .get(requireAuth, getTaskById)
  .put(requireAuth, updateTask)
  .delete(requireAuth, deleteTask);

module.exports = router;
