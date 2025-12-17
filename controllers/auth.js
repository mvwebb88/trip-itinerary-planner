const bcrypt = require('bcrypt');
const User = require('../models/User');

const SALT_ROUNDS = 10;

exports.renderSignUp = (req, res) => {
  res.render('auth/sign-up', { error: null });
};

exports.renderSignIn = (req, res) => {
  res.render('auth/sign-in', { error: null });
};

exports.signUp = async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    if (!username || !password) {
      return res.render('auth/sign-up', { error: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.render('auth/sign-up', { error: 'Passwords do not match.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ username: username.trim(), passwordHash });

    req.session.userId = user._id;
    return res.redirect('/trips');
  } catch (err) {
    const msg = err.code === 11000 ? 'Username is already taken.' : 'Sign up failed.';
    return res.render('auth/sign-up', { error: msg });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username.trim() });
    if (!user) return res.render('auth/sign-in', { error: 'Invalid credentials.' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.render('auth/sign-in', { error: 'Invalid credentials.' });

    req.session.userId = user._id;
    return res.redirect('/trips');
  } catch (err) {
    return res.render('auth/sign-in', { error: 'Sign in failed.' });
  }
};

exports.signOut = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
