// controllers/auth.js
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Render sign-up page
function renderSignUp(req, res) {
  res.render("auth/sign-up", { error: null });
}

// Handle sign-up
async function signUp(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).render("auth/sign-up", { error: "All fields are required." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).render("auth/sign-up", { error: "Email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });

    req.session.user = { _id: user._id, name: user.name, email: user.email };

    req.session.save(() => {
      res.redirect("/trips");
    });
  } catch (err) {
    console.error("SIGN-UP ERROR:", err);
    return res.status(500).render("auth/sign-up", { error: "Something went wrong. Check terminal." });
  }
}

// Render sign-in page
function renderSignIn(req, res) {
  res.render("auth/sign-in", { error: null });
}

// Handle sign-in
async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    console.log("SIGNIN HIT:", { email });

    if (!email || !password) {
      return res.status(400).render("auth/sign-in", { error: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).render("auth/sign-in", { error: "Invalid email or password." });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).render("auth/sign-in", { error: "Invalid email or password." });
    }

    req.session.user = { _id: user._id, name: user.name, email: user.email };

    req.session.save(() => {
      res.redirect("/trips");
    });
  } catch (err) {
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





