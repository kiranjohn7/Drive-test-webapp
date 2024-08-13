module.exports = (req, res) => {
  // Assuming req.user contains the user information
  const userType = req.user ? req.user.userType : null;
  res.render("home", { userType });
};