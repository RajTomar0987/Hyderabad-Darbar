const db = require('../data/db');

/**
 * @desc   Create table reservation
 * @route  POST /api/reservations
 */
const createReservation = async (req, res) => {
  try {
    const { name, email, phone, guests, date, time, message } = req.body;

    const errors = [];
    if (!name || typeof name !== 'string' || !name.trim()) {
      errors.push('name is required');
    }
    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      errors.push('phone is required');
    }
    if (guests === undefined || isNaN(Number(guests)) || Number(guests) < 1) {
      errors.push('guests must be a valid positive number');
    }
    if (!date || typeof date !== 'string' || !date.trim()) {
      errors.push('date is required');
    }
    if (!time || typeof time !== 'string' || !time.trim()) {
      errors.push('time is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    const userId = req.user ? req.user.id : null;
    const userEmail = email ? email.trim() : (req.user ? req.user.email : '');

    const newReservation = await db.createReservation({
      userId,
      name: name.trim(),
      email: userEmail,
      phone: phone.trim(),
      guests: Number(guests),
      date: date.trim(),
      time: time.trim(),
      message: message ? message.trim() : ''
    });

    res.status(201).json({
      success: true,
      message: 'Reservation confirmed successfully',
      data: newReservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create reservation: ' + error.message
    });
  }
};

/**
 * @desc   Get all reservations (admin viewing)
 * @route  GET /api/reservations
 */
const getReservations = async (req, res) => {
  try {
    const reservations = await db.getReservations();
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve reservations: ' + error.message
    });
  }
};

/**
 * @desc   Update reservation status (admin)
 * @route  PATCH /api/reservations/:id/status
 */
const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const updated = await db.updateReservationStatus(id, status);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Reservation '${id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      message: `Reservation status updated to '${status}'`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update reservation status: ' + error.message
    });
  }
};

module.exports = {
  createReservation,
  getReservations,
  updateReservationStatus
};
