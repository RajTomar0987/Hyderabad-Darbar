const express = require('express');
const router = express.Router();
const { syncProfile, getMe, login } = require('../controllers/auth.controller');
const { requireAuth, optionalAuth } = require('../middleware/auth');

router.post('/sync-profile', requireAuth, syncProfile);
router.post('/login', optionalAuth, login);
router.get('/me', requireAuth, getMe);

module.exports = router;
