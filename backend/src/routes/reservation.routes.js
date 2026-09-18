const express = require('express');
const router = express.Router();
const { createReservation, getReservations, updateReservationStatus } = require('../controllers/reservation.controller');
const { requireAdmin, optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, createReservation);
router.get('/', requireAdmin, getReservations);
router.patch('/:id/status', requireAdmin, updateReservationStatus);

module.exports = router;
