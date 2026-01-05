// middleware/isSignedIn.js
module.exports = function isSignedIn(req, res, next) {
  // Protect routes by requiring a logged-in session user
  if (!req.session.user || !req.session.user.id) return res.redirect("/auth/sign-in");
  next();
};




