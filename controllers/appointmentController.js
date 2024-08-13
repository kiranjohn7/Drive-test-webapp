const Appointment = require("../models/AppointmentModel");
const UserModel = require("../models/UserModel");

// Render the appointment page for admins
module.exports.renderAppointmentPage = async (req, res) => {
  try {
    const userId = req.session.user.userId;

    if (!userId) {
      return res.redirect("/login");
    }

    const data = await Appointment.find({isTimeSlotAvailable: true});
    res.render("appointment",  {data} );
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
};

// Add appointments with multiple time slots
module.exports.addAppointment = async (req, res) => {
  try {
    const dates = JSON.parse(req.body.timeSlots);
    const dateTimeArr = [];

    for (let dateTime in dates) {
      const dateObj = {
        date: dateTime,
        timeSlots: transformTimeSlots(dates[dateTime])
      };
      dateTimeArr.push(dateObj);
    }

    function transformTimeSlots(timeSlots) {
      return timeSlots.map(time => ({
        time: time.padStart(5, '0'), // Ensure time is in 'HH:MM' format
        isBooked: false
      }));
    }

    console.log("dateTimeArr", dateTimeArr);

    for (const e of dateTimeArr) {
      const { date, timeSlots } = e;

      // Check if the appointment for the date already exists
      let appointment = await Appointment.findOne({ date });

      if (appointment) {
        // If appointment already exists, update the time slots
        appointment.timeSlots = timeSlots;
      } else {
        // Create a new appointment if it doesn't exist
        appointment = new Appointment({
          date,
          timeSlots,
          isTimeSlotAvailable: true
        });
      }

      await appointment.save();
    }

    res.redirect("/"); // Redirect to the appointment page or another page after all operations are complete
  } catch (error) {
    console.error("Error adding appointment:", error);
    res.status(500).render("error", { message: "Error adding appointment" });
  }
};

module.exports.resultController = async (req, res) => {
  try {
    const filter = {status:{$in:[true,false]}}
    const status = req.flash('status');
    console.log(status)
    if(status.length > 0){
      console.log(filter,"in")
      filter.status = status[0];
      console.log(filter,"in")
    }
console.log(filter)
    const user = await UserModel.find(filter).populate('appointments');

    res.render('result', {user})
    console.log(user)

  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
};

exports.postresult = async (req, res) => {
  try {

    req.flash('status', req.body.status);
    res.redirect('/result')
  }
  catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
} 