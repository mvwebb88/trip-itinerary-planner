// controllers/auth.js
const bcrypt = require("bcrypt");
const User = require("../models/User");

function cleanEmail(email) {
  return String(email || "").trim().toLowerCase();
}

exports.renderSignUp = (req, res) => {
  res.render("auth/sign-up", { error: null, form: { name: "", email: "" } });
};

exports.renderSignIn = (req, res) => {
  res.render("auth/sign-in", { error: null, form: { email: "" } });
};

exports.signUp = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = cleanEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!name || !email || !password) {
      return res.status(400).render("auth/sign-up", {
        error: "Please fill out name, email, and password.",
        form: { name, email },
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).render("auth/sign-up", {
        error: "That email is already registered. Try signing in.",
        form: { name, email },
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });

    req.session.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    // IMPORTANT: save session before redirect so it sticks
    req.session.save((err) => {
      if (err) {
        console.log("SESSION SAVE ERROR (signUp):", err);
        return res.status(500).render("auth/sign-up", {
          error: "Could not start a session. Try again.",
          form: { name, email },
        });
      }
      return res.redirect("/trips");
    });
  } catch (err) {
    console.log("SIGN-UP ERROR:", err);
    return res.status(500).render("auth/sign-up", {
      error: "Something went wrong. Try again.",
      form: { name: req.body.name || "", email: req.body.email || "" },
    });
  }
};

exports.signIn = async (req, res) => {
  try {
    const email = cleanEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).render("auth/sign-in", {
        error: "Please enter your email and password.",
        form: { email },
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).render("auth/sign-in", {
        error: "Invalid email or password.",
        form: { email },
      });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).render("auth/sign-in", {
        error: "Invalid email or password.",
        form: { email },
      });
    }

    req.session.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    // IMPORTANT: save session before redirect so it sticks
    req.session.save((err) => {
      if (err) {
        console.log("SESSION SAVE ERROR (signIn):", err);
        return res.status(500).render("auth/sign-in", {
          error: "Could not start a session. Try again.",
          form: { email },
        });
      }
      return res.redirect("/trips");
    });
  } catch (err) {
    console.log("SIGN-IN ERROR:", err);
    return res.status(500).render("auth/sign-in", {
      error: "Something went wrong. Try again.",
      form: { email: req.body.email || "" },
    });
  }
};

exports.signOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log("SIGN-OUT ERROR:", err);
    res.clearCookie("connect.sid");
    return res.redirect("/");
  });
};













