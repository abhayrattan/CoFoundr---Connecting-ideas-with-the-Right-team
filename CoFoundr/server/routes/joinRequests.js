const express = require('express');
const router = express.Router();
const { createRequest, getMyRequests, updateRequestStatus } = require('../controllers/joinRequestController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/', requireAuth, createRequest);
router.get('/my', requireAuth, getMyRequests);
router.put('/:requestId', requireAuth, updateRequestStatus);

module.exports = router;
