// routes/auth.js
const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth");

// Show forms
router.get("/sign-up", authCtrl.renderSignUp);
router.get("/sign-in", authCtrl.renderSignIn);

// Handle submits
router.post("/sign-up", authCtrl.signUp);
router.post("/sign-in", authCtrl.signIn);

// Logout
router.post("/sign-out", authCtrl.signOut);

module.exports = router;





