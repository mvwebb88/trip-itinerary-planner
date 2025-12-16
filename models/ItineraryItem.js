const mongoose = require('mongoose');

const itineraryItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
    },
    type: {
      type: String,
      enum: ['activity', 'lodging', 'transportation'],
      required: true,
    },
    notes: {
      type: String,
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ItineraryItem', itineraryItemSchema);
