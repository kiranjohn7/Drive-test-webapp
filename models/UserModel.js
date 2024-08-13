const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

// Schema for car details
const CarDetailsSchema = new Schema({
  make: { type: String, default: "default" },
  model: { type: String, default: "default" },
  year: { type: Number, default: 0 },
  plateNumber: { type: String, default: "default" }
});

// User schema
const UserModelSchema = new Schema({
  firstname: { type: String, default: "default" },
  lastname: { type: String, default: "default" },
  licenseNo: { type: String, default: "default" },
  age: { type: Number, default: 0 },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    enum: ["Driver", "Examiner", "Admin"],
    default: "Driver",
  },
  examinerType: {
    type: String,
    enum: ["G", "G2"],
    default: "G2",
  },
  carDetails: CarDetailsSchema,
  appointments: {
    type: Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  slotId :  {
    type: Schema.Types.ObjectId,
  },
  status: {
    type: Boolean,
    default: null,
  },
  comments: {
    type: String,
    default: "",
  }
});

// Hash the password before saving the user
UserModelSchema.pre("save", function (next) {
  const user = this;
  if (user.password) {
    bcrypt.hash(user.password, 10, (error, hash) => {
      if (error) {
        return next(error);
      }
      user.password = hash;
      next();
    });
  } else {
    next();
  }
});

const UserModel = mongoose.model("UserModel", UserModelSchema);
module.exports = UserModel;
