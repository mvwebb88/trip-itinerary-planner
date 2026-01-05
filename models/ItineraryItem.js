// models/ItineraryItem.js
const mongoose = require("mongoose");

const itineraryItemSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    date: { type: Date },
    time: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ItineraryItem", itineraryItemSchema);

