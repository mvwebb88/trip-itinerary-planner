// controllers/auth.js
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Render sign-up page
function renderSignUp(req, res) {
  res.render("auth/sign-up", { error: null });
}

// Handle sign-up submit
async function signUp(req, res) {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).render("auth/sign-up", { error: "All fields are required." });
    }

    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).render("auth/sign-up", { error: "Email is already in use." });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });

    // Save user in session
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    // Go to trips after signup
    return res.redirect("/trips");
  } catch (err) {
    // Log the real error
    console.error("SIGN-UP ERROR:", err);
    return res.status(500).render("auth/sign-up", { error: "Something went wrong. Check terminal." });
  }
}

// Render sign-in page
function renderSignIn(req, res) {
  res.render("auth/sign-in", { error: null });
}

// Handle sign-in submit
async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).render("auth/sign-in", { error: "Email and password are required." });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).render("auth/sign-in", { error: "Invalid credentials." });
    }

    // Compare password
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).render("auth/sign-in", { error: "Invalid credentials." });
    }

    // Save user in session
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    // Go to trips after login
    return res.redirect("/trips");
  } catch (err) {
    // Log the real error
    console.error("SIGN-IN ERROR:", err);
    return res.status(500).render("auth/sign-in", { error: "Something went wrong. Check terminal." });
  }
}

// Handle sign-out
function signOut(req, res) {
  req.session.destroy(() => {
    res.redirect("/");
  });
}

module.exports = {
  renderSignUp,
  signUp,
  renderSignIn,
  signIn,
  signOut,
};



