// middleware/isSignedIn.js
module.exports = function isSignedIn(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.redirect("/auth/sign-in");
};

