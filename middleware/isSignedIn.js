// middleware/isSignedIn.js
module.exports = function isSignedIn(req, res, next) {
  // Works whether you store user or userId in the session
  if (req.session.user || req.session.userId) return next();
  return res.redirect("/auth/sign-in");
};







