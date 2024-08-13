const UserModel = require("../models/UserModel");
const Appointment = require("../models/AppointmentModel");


module.exports = async (req, res) => {
  try {
    const userId = req.session.user.userId;

    if (!userId) {
      return res.redirect("/login"); // Redirect to login if the user is not logged in
    }

    // Fetch user data from the database
    const user = await UserModel.findById(userId);

    if (!user) {
      console.log("User not found");
      return res.status(404).render("error", { message: "User not found" });
    }


    const today = new Date().toISOString().split("T")[0];
 const appointments = await Appointment.find({ date: today });
let availableSlots = [];
if (appointments && appointments.length > 0) {
  appointments.forEach((appointment) => {
    if (appointment.timeSlots && Array.isArray(appointment.timeSlots)) {
      const slots = appointment.timeSlots
        .filter((slot) => !slot.isBooked)
        .map((slot) => slot.time);
      availableSlots = availableSlots.concat(slots);
    }
  });
} 


console.log("Available Slots:", availableSlots); 
    // Render the G_page with user data
    res.render("g", { user, availableSlots });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
};
