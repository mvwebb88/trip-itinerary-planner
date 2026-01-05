// Import mongoose
const mongoose = require("mongoose");

// Define Trip schema
const tripSchema = new mongoose.Schema(
  {
    destination: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference User model
      required: true,
    },
  },
  { timestamps: true }
);

// Export Trip model
module.exports = mongoose.model("Trip", tripSchema);

