const express = require('express');
const router = express.Router();
const { getReviews, createReview, deleteReview } = require('../controllers/review.controller');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', getReviews);
router.post('/', requireAuth, createReview);
router.delete('/:id', requireAdmin, deleteReview);

module.exports = router;
