const bcrypt = require("bcrypt");
const User = require("../models/User");

function renderSignUp(req, res) {
  res.render("auth/sign-up");
}

function renderSignIn(req, res) {
  res.render("auth/sign-in");
}

async function signUp(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) return res.redirect("/auth/sign-up");

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.redirect("/auth/sign-up");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    req.session.user = { _id: user._id, name: user.name, email: user.email };

    res.redirect("/trips");
  } catch (err) {
    console.log("SIGN UP ERROR:", err.message);
    res.redirect("/auth/sign-up");
  }
}

async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.redirect("/auth/sign-in");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.redirect("/auth/sign-in");

    req.session.user = { _id: user._id, name: user.name, email: user.email };

    res.redirect("/trips");
  } catch (err) {
    console.log("SIGN IN ERROR:", err.message);
    res.redirect("/auth/sign-in");
  }
}

function signOut(req, res) {
  req.session.destroy(() => {
    res.redirect("/");
  });
}

module.exports = {
  renderSignUp,
  renderSignIn,
  signUp,
  signIn,
  signOut,
};

