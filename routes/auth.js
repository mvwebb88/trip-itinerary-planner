const express = require("express");
const router = express.Router();

const authCtrl = require("../controllers/auth");

router.get("/sign-up", authCtrl.renderSignUp);
router.post("/sign-up", authCtrl.signUp);

router.get("/sign-in", authCtrl.renderSignIn);
router.post("/sign-in", authCtrl.signIn);

router.post("/sign-out", authCtrl.signOut);

module.exports = router;

