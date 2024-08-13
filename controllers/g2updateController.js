const UserModel = require("../models/UserModel");

module.exports = async (req, res) => {
  try {
    console.log(req.body)
    const getInfo = await UserModel.findOneAndUpdate(
      {
        licenseNo: req.body.licenseNo,
      },
      {
        "carDetails.make": req.body.make,
        "carDetails.model": req.body.model,
        "carDetails.year": req.body.year,
        "carDetails.plateNumber": req.body.plateNumber,
      },
      {
        new: true,
      }
    );
    console.log(getInfo);
    res.render("g", { user: getInfo });
  } catch (error) {
    console.log(error);
    res.render("g");
  }
};
