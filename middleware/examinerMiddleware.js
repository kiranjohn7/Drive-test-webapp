module.exports = (req, res, next) => {
    if (req.session.user && req.session.user.userId && req.session.user.userType === "Examiner") {
      return next();
    } else {
      return res.redirect("/login");
    }
  };
  