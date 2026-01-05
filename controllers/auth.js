// controllers/auth.js
const bcrypt = require("bcrypt");
const User = require("../models/User");

function setSessionUser(req, user) {
  // Store only safe user info in session
  req.session.user = { id: user._id.toString(), name: user.name, email: user.email };
}

exports.renderSignUp = (req, res) => {
  // Always pass error so EJS never crashes
  res.render("auth/sign-up", { error: null });
};

exports.renderSignIn = (req, res) => {
  // Always pass error so EJS never crashes
  res.render("auth/sign-in", { error: null });
};

exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).render("auth/sign-up", { error: "All fields are required." });
    }

    // Prevent duplicate emails
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).render("auth/sign-up", { error: "Email already in use. Try signing in." });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
    });

    // Log them in
    setSessionUser(req, user);

    // Redirect to trips
    res.redirect("/trips");
  } catch (err) {
    console.log("SIGN-UP ERROR:", err);
    res.status(500).render("auth/sign-up", { error: "Something went wrong. Check terminal." });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).render("auth/sign-in", { error: "Email and password are required." });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).render("auth/sign-in", { error: "Invalid email or password." });
    }

    // Verify password
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).render("auth/sign-in", { error: "Invalid email or password." });
    }

    // Save session
    setSessionUser(req, user);

    // Redirect to trips
    res.redirect("/trips");
  } catch (err) {
    console.log("SIGN-IN ERROR:", err);
    res.status(500).render("auth/sign-in", { error: "Something went wrong. Check terminal." });
  }
};

exports.signOut = (req, res) => {
  // Destroy session on logout
  req.session.destroy(() => res.redirect("/"));
};







