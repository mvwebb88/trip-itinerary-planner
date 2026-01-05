// routes/trips.js
const express = require("express");
const router = express.Router();

const isSignedIn = require("../middleware/isSignedIn");
const tripsCtrl = require("../controllers/trips");

// Protect all trips routes
router.use(isSignedIn);

// Trips index
router.get("/", tripsCtrl.index);

// New trip form
router.get("/new", tripsCtrl.renderNew);

// Create trip
router.post("/", tripsCtrl.create);

// Show trip
router.get("/:tripId", tripsCtrl.show);

// Edit trip form
router.get("/:tripId/edit", tripsCtrl.renderEdit);

// Update trip
router.put("/:tripId", tripsCtrl.update);

// Delete trip
router.delete("/:tripId", tripsCtrl.delete);

module.exports = router;

