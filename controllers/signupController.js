const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  const {
    firstname,
    lastname,
    username,
    password,
    repeatPassword,
    userType,
    licenseNo,
    age,
    carMake,
    carModel,
    carYear,
    carPlateNumber,
  } = req.body;

  console.log("Signup data received:", req.body);

  try {
    // Check if passwords match
    if (password !== repeatPassword) {
      return res.status(400).send("Passwords do not match");
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }

    // Create new user
    const newUser = new UserModel({
      firstname,
      lastname,
      username,
      password,
      licenseNo,
      age,
      userType,
      carDetails: {
        make: carMake,
        model: carModel,
        year: carYear,
        plateNumber: carPlateNumber,
      },
    });

    console.log("New user to be saved:", newUser);

    await newUser.save();
    console.log("New user created:", newUser);

    // Successful signup
    res.redirect("/login"); // Redirect to login page after successful signup
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
