// routes/auth.js
const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth");

// Show sign-up form
router.get("/sign-up", authCtrl.renderSignUp);

// Process sign-up
router.post("/sign-up", authCtrl.signUp);

// Show sign-in form
router.get("/sign-in", authCtrl.renderSignIn);

// Process sign-in
router.post("/sign-in", authCtrl.signIn);

// Sign out
router.get("/sign-out", authCtrl.signOut);

module.exports = router;



