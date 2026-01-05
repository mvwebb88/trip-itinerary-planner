// controllers/trips.js
const Trip = require("../models/Trip");

// Show all trips for the signed-in user
async function index(req, res) {
  try {
    const trips = await Trip.find({ user: req.session.user._id }).sort({ createdAt: -1 });
    res.render("trips/index", { trips });
  } catch (err) {
    console.error("TRIPS INDEX ERROR:", err);
    res.redirect("/");
  }
}

// Show form to create a new trip
function renderNew(req, res) {
  res.render("trips/new");
}

// Create a new trip for the signed-in user
async function create(req, res) {
  try {
    req.body.user = req.session.user._id;
    const trip = await Trip.create(req.body);
    res.redirect(`/trips/${trip._id}`);
  } catch (err) {
    console.error("TRIPS CREATE ERROR:", err);
    res.redirect("/trips");
  }
}

// Show one trip (must belong to signed-in user)
async function show(req, res) {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, user: req.session.user._id });
    if (!trip) return res.redirect("/trips");
    res.render("trips/show", { trip });
  } catch (err) {
    console.error("TRIPS SHOW ERROR:", err);
    res.redirect("/trips");
  }
}

// Show edit form (must belong to signed-in user)
async function renderEdit(req, res) {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, user: req.session.user._id });
    if (!trip) return res.redirect("/trips");
    res.render("trips/edit", { trip });
  } catch (err) {
    console.error("TRIPS EDIT FORM ERROR:", err);
    res.redirect("/trips");
  }
}

// Update trip (must belong to signed-in user)
async function update(req, res) {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.tripId, user: req.session.user._id },
      req.body,
      { new: true }
    );
    if (!trip) return res.redirect("/trips");
    res.redirect(`/trips/${trip._id}`);
  } catch (err) {
    console.error("TRIPS UPDATE ERROR:", err);
    res.redirect("/trips");
  }
}

// Delete trip (must belong to signed-in user)
async function deleteTrip(req, res) {
  try {
    await Trip.findOneAndDelete({ _id: req.params.tripId, user: req.session.user._id });
    res.redirect("/trips");
  } catch (err) {
    console.error("TRIPS DELETE ERROR:", err);
    res.redirect("/trips");
  }
}

module.exports = {
  index,
  renderNew,
  create,
  show,
  renderEdit,
  update,
  delete: deleteTrip,
};



