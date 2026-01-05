// controllers/trips.js
const Trip = require("../models/Trip");

exports.index = async (req, res) => {
  try {
    const trips = await Trip.find({ owner: req.session.user._id }).sort({ createdAt: -1 });
    res.render("trips/index", { trips, error: null });
  } catch (err) {
    console.log("TRIPS INDEX ERROR:", err);
    res.status(500).render("trips/index", { trips: [], error: "Something went wrong. Check terminal." });
  }
};

exports.renderNew = (req, res) => {
  res.render("trips/new", { error: null });
};

exports.create = async (req, res) => {
  try {
    const { title, destination, startDate, endDate, notes } = req.body;

    await Trip.create({
      title: title?.trim(),
      destination: destination?.trim(),
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      notes: notes?.trim(),
      owner: req.session.user._id,
    });

    res.redirect("/trips");
  } catch (err) {
    console.log("TRIPS CREATE ERROR:", err);
    res.status(400).render("trips/new", { error: "Could not create trip. Check your fields." });
  }
};

exports.show = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, owner: req.session.user._id });
    if (!trip) return res.redirect("/trips");
    res.render("trips/show", { trip, error: null });
  } catch (err) {
    console.log("TRIPS SHOW ERROR:", err);
    res.redirect("/trips");
  }
};

exports.renderEdit = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, owner: req.session.user._id });
    if (!trip) return res.redirect("/trips");
    res.render("trips/edit", { trip, error: null });
  } catch (err) {
    console.log("TRIPS EDIT ERROR:", err);
    res.redirect("/trips");
  }
};

exports.update = async (req, res) => {
  try {
    const { title, destination, startDate, endDate, notes } = req.body;

    await Trip.findOneAndUpdate(
      { _id: req.params.id, owner: req.session.user._id },
      {
        title: title?.trim(),
        destination: destination?.trim(),
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        notes: notes?.trim(),
      },
      { runValidators: true }
    );

    res.redirect(`/trips/${req.params.id}`);
  } catch (err) {
    console.log("TRIPS UPDATE ERROR:", err);
    res.redirect("/trips");
  }
};

exports.destroy = async (req, res) => {
  try {
    await Trip.findOneAndDelete({ _id: req.params.id, owner: req.session.user._id });
    res.redirect("/trips");
  } catch (err) {
    console.log("TRIPS DELETE ERROR:", err);
    res.redirect("/trips");
  }
};








