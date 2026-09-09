const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadResume, deleteResume } = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);

router.post('/profile/resume', requireAuth, upload.single('resume'), uploadResume);
router.delete('/profile/resume', requireAuth, deleteResume);

module.exports = router;
