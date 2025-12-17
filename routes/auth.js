const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

// Sign up
router.get('/sign-up', authController.renderSignUp);
router.post('/sign-up', authController.signUp);

// Sign in
router.get('/sign-in', authController.renderSignIn);
router.post('/sign-in', authController.signIn);

// Sign out
router.post('/sign-out', authController.signOut);

module.exports = router;
