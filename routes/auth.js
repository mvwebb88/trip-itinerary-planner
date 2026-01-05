// routes/auth.js
const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth");

// Pages
router.get("/sign-up", authCtrl.renderSignUp);
router.get("/sign-in", authCtrl.renderSignIn);

// Actions
router.post("/sign-up", authCtrl.signUp);
router.post("/sign-in", authCtrl.signIn);
router.post("/sign-out", authCtrl.signOut);

module.exports = router;








