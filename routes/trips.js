// routes/trips.js
const express = require("express");
const router = express.Router();

const isSignedIn = require("../middleware/isSignedIn");
const tripsCtrl = require("../controllers/trips");

router.get("/", isSignedIn, tripsCtrl.index);
router.get("/new", isSignedIn, tripsCtrl.new);
router.post("/", isSignedIn, tripsCtrl.create);
router.get("/:tripId", isSignedIn, tripsCtrl.show);
router.get("/:tripId/edit", isSignedIn, tripsCtrl.edit);
router.put("/:tripId", isSignedIn, tripsCtrl.update);
router.delete("/:tripId", isSignedIn, tripsCtrl.delete);

module.exports = router;
