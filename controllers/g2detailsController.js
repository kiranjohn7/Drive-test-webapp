const UserModel = require("../models/UserModel");

module.exports = async (req, res) => {
  try {
    const { firstname, lastname, licenseNo, age, make, model, year, plateNumber } =
      req.body;
    console.log(req.body);

    const userId = req.session.user.userId; // Assuming userId is stored in the session

    // Update user document in MongoDB
    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          firstname,
          lastname,
          licenseNo,
          age,
          "carDetails.make": make,
          "carDetails.model": model,
          "carDetails.year": year,
          "carDetails.plateNumber": plateNumber,
        },
      },
      { new: true } // To return the updated document
    );

    if (!updateUser) {
      // Handle case where user is not found
      return res.render("g2", { error: "User not found" });
    }
    console.log(updateUser);

    // Redirect to a success page or do something else on successful update
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.render("error", { message: "Failed to update user information" });
  }
};
