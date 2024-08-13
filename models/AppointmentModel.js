const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema for appointment
const AppointmentSchema = new Schema({
  date: {
    type: String,
    required: true
  },
  timeSlots: [{
    time: String,
    isBooked: {
      type: Boolean,
      default: false
    }
  }],
  isTimeSlotAvailable: {
    type: Boolean,
    default: false
  }
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;
