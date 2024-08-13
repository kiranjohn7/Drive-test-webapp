const express = require('express');
const router = express.Router();
const Appointment = require('../models/AppointmentModel');

// Endpoint to fetch available time slots for a specific date
router.get('/available-time-slots', async (req, res) => {
  const { date } = req.query;

  // Basic validation
  if (!date) {
    return res.status(400).json({ error: 'Date query parameter is required' });
  }

  try {
    const appointment = await Appointment.findOne({ date }).exec();
    console.log("appointments", appointment);
    if (!appointment) {
      return res.json({ timeSlots: [] });
    }

    const availableTimeSlots = appointment.timeSlots.filter(slot => !slot.isBooked);
    res.json({ appointmentId:appointment._id, timeSlots: availableTimeSlots });
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
