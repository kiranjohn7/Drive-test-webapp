const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Login attempt:", { username, password });

    if (!username || !password) {
      console.log("Username or password not provided");
      return res.status(400).send("Invalid username or password");
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
      console.log("User not found");
      return res.status(400).send("Invalid username or password");
    } else {
      bcrypt.compare(password, (user.password), (err, result) => {
        if (err) {
          console.error("Error comparing password:", err);
          return res.status(400).send("Invalid username or password");
        } else {
          if (result) {
            // Set session variables
            const userObj = {
              username: user.username,
              userId: user._id,
              userType: user.userType
            }
            req.session.user = userObj;
            res.redirect("/");
          } else {
            console.log("Password does not match");
            console.log(result, err);
            
            return res.status(400).send("Invalid username or password");
          }
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
