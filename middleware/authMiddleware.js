module.exports = (req, res, next) => {
  if (req.session.user && req.session.user.userId) {
    return next();
  } else {
    return res.redirect("/login");
  }
};
