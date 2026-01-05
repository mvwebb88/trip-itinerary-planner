// controllers/auth.js
const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.renderSignUp = (req, res) => {
  res.render("auth/sign-up", { error: null });
};

exports.renderSignIn = (req, res) => {
  res.render("auth/sign-in", { error: null });
};

exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });

    if (existing) return res.status(400).render("auth/sign-up", { error: "Email already in use." });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    req.session.user = { _id: user._id, name: user.name, email: user.email };
    res.redirect("/trips");
  } catch (err) {
    console.log("SIGN-UP ERROR:", err);
    res.status(500).render("auth/sign-up", { error: "Something went wrong. Check terminal." });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).render("auth/sign-in", { error: "Invalid email or password." });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).render("auth/sign-in", { error: "Invalid email or password." });

    req.session.user = { _id: user._id, name: user.name, email: user.email };
    res.redirect("/trips");
  } catch (err) {
    console.log("SIGN-IN ERROR:", err);
    res.status(500).render("auth/sign-in", { error: "Something went wrong. Check terminal." });
  }
};

exports.signOut = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};








