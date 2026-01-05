// routes/trips.js
const express = require("express");
const router = express.Router();
const tripsCtrl = require("../controllers/trips");
const isSignedIn = require("../middleware/isSignedIn");

// Trips pages
router.get("/", isSignedIn, tripsCtrl.index);
router.get("/new", isSignedIn, tripsCtrl.renderNew);
router.post("/", isSignedIn, tripsCtrl.create);
router.get("/:id", isSignedIn, tripsCtrl.show);
router.get("/:id/edit", isSignedIn, tripsCtrl.renderEdit);
router.put("/:id", isSignedIn, tripsCtrl.update);
router.delete("/:id", isSignedIn, tripsCtrl.destroy);

module.exports = router;





