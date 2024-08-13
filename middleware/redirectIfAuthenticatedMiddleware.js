module.exports = (req, res, next) => {
  if (req.session.user && req.session.user.userId) {
    return res.redirect("/");
  }
  next();
};
