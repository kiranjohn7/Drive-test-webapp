const Appointment = require("../models/AppointmentModel");
const UserModel = require("../models/UserModel");

// Function to book an appointment
const bookAppointment = async (
  userId,
  appointmentDate,
  appointmentId,
  selectedTimeSlot
) => {
  try {
    console.log("userId:", userId);
    console.log("appointmentId:", appointmentId);
    console.log("selectedTimeSlot:", JSON.parse(selectedTimeSlot)[appointmentDate]);

    // Update the appointment to mark the specific time slot as booked
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        $set: { "timeSlots.$[slot].isBooked": true },
      },
      {
        arrayFilters: [
          {
            "slot.time": JSON.parse(selectedTimeSlot)[appointmentDate].toString(),
          },
        ],
        new: true,
      }
    );
    console.log("Updated appointment:", appointment);

    let slotId = null;
    const timeSlot = JSON.parse(selectedTimeSlot)[appointmentDate].toString();
    appointment.timeSlots.forEach((e) => {
      if (e.time == timeSlot) {
        slotId = e._id;
      }
    });

    // Add the appointment to the user's list of appointments
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { appointments: appointmentId, slotId } },
      { new: true }
    );
    console.log("Updated user:", user);
  } catch (error) {
    console.error("Error booking appointment:", error);
  }
};

// Function to render the G2 page with available appointments
module.exports.renderG2Page = async (req, res) => {
  try {
    const userId = req.session.user.userId;

    if (!userId) {
      return res.redirect("/login");
    }

    const user = await UserModel.findById(userId).populate("appointments");

    let timeSlot;
    if (user.appointments && user.slotId) {
      const appointment = user.appointments;
      timeSlot = appointment.timeSlots.find(val => val._id.toString() === user.slotId.toString());
    } else {
      timeSlot = null;
    }

    if (!user) {
      console.log("User not found");
      return res.status(404).render("error", { message: "User not found" });
    }

    const comments = user.comments || [];
    const status = user.status;

    res.render("g2", { user, timeSlot, comments, status });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
};

// Route to handle booking an appointment
module.exports.bookAppointment = async (req, res) => {
  console.log("Request body:", req.body);
  const { appointmentId, appointmentDate, selectedTimeSlots } = req.body;
  const userId = req.session.user.userId;

  if (!userId) {
    return res.redirect("/login");
  }

  try {
    await bookAppointment(
      userId,
      appointmentDate,
      appointmentId,
      selectedTimeSlots
    );
    res.redirect("/g2");
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).render("error", { message: "Error booking appointment" });
  }
};
