// controllers/trips.js
const Trip = require("../models/Trip");

module.exports = {
  index,
  new: newTrip,
  create,
  show,
  edit,
  update,
  delete: deleteTrip,
};

async function index(req, res) {
  const trips = await Trip.find({ owner: req.session.user._id }).sort({ createdAt: -1 });
  res.render("trips/index", { trips });
}

function newTrip(req, res) {
  res.render("trips/new");
}

async function create(req, res) {
  try {
    req.body.owner = req.session.user._id;
    await Trip.create(req.body);
    res.redirect("/trips");
  } catch (err) {
    console.log(err);
    res.redirect("/trips/new");
  }
}

async function show(req, res) {
  const trip = await Trip.findOne({
    _id: req.params.tripId,
    owner: req.session.user._id,
  });

  if (!trip) return res.redirect("/trips");
  res.render("trips/show", { trip });
}

async function edit(req, res) {
  const trip = await Trip.findOne({
    _id: req.params.tripId,
    owner: req.session.user._id,
  });

  if (!trip) return res.redirect("/trips");
  res.render("trips/edit", { trip });
}

async function update(req, res) {
  try {
    await Trip.findOneAndUpdate(
      { _id: req.params.tripId, owner: req.session.user._id },
      req.body,
      { new: true }
    );
    res.redirect(`/trips/${req.params.tripId}`);
  } catch (err) {
    console.log(err);
    res.redirect("/trips");
  }
}

async function deleteTrip(req, res) {
  await Trip.findOneAndDelete({
    _id: req.params.tripId,
    owner: req.session.user._id,
  });
  res.redirect("/trips");
}


