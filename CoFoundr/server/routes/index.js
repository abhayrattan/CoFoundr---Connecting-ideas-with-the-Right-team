const express = require('express');
const router = express.Router();
const healthRoutes = require('./health');
const authRoutes = require('./auth');
const usersRoutes = require('./users');
const startupsRoutes = require('./startups');
const joinRequestsRoutes = require('./joinRequests');
const teamsRoutes = require('./teams');
const tasksRoutes = require('./tasks');
const notificationsRoutes = require('./notifications');
const chatRoutes = require('./chat');
const adminRoutes = require('./admin');
const reviewsRoutes = require('./reviews');

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/startups', startupsRoutes);
router.use('/join-requests', joinRequestsRoutes);
router.use('/teams', teamsRoutes);
router.use('/tasks', tasksRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/chat', chatRoutes);
router.use('/admin', adminRoutes);
router.use('/reviews', reviewsRoutes);

module.exports = router;
