module.exports = (req, res, next) => {
  if (req.session.user && req.session.user.userId && req.session.user.userType === "Driver") {
    return next();
  } else {
    return res.redirect("/login");
  }
};
