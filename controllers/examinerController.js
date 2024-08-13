
const User = require("../models/UserModel");

module.exports.getExaminerPage = async (req, res) => {
  try {
    const examinerType = req.query.examinerType || 'G2';
    const drivers = await User.find({ userType: "Driver",appointments:{$ne:null}, examinerType: examinerType,status:null });
    res.render("examiner", { examinerType, drivers, error: null });
  } catch (error) {
    console.error(error);
    res.status(400).render("examiner", { examinerType: req.query.examinerType || 'G', drivers: [], error: "Error in Examiner page" });
  }
};

module.exports.updateDriverStatus = async (req, res) => {
  try {
    const { driverId, status, comments } = req.body;

    if (!driverId || typeof status === 'undefined') {
      return res.status(400).send("Missing required fields");
    }

    // driver.status = status === 'true'; // Convert 'true'/'false' to Boolean
    // driver.comments = comments || ""; // Ensure comments are not undefined

    const driver = await User.findByIdAndUpdate(
      driverId, { status, comments},
      { new: true }
    );
    res.redirect('/examiner');
  } catch (error) {
    console.error("Error updating driver status:", error);
    res.status(500).send("Error updating driver status");
  }
};





