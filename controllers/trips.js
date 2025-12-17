const Trip = require('../models/Trip');

exports.index = async (req, res) => {
  try {
    const trips = await Trip.find({ owner: req.session.userId }).sort({ startDate: 1 });
    res.render('trips/index', { trips });
  } catch (err) {
    res.status(500).send('Error loading trips');
  }
};

exports.new = (req, res) => {
  res.render('trips/new', { error: null });
};

exports.create = async (req, res) => {
  try {
    const { destination, startDate, endDate, notes } = req.body;

    await Trip.create({
      destination,
      startDate,
      endDate,
      notes,
      owner: req.session.userId,
    });

    res.redirect('/trips');
  } catch (err) {
    res.render('trips/new', { error: 'Could not create trip. Please try again.' });
  }
};
