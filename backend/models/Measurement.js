const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    category: {
      type: String,
      enum: ["Blouse", "Chudithar", "Pant"],
      required: true,
    },
    // Field names differ per category (see measurementFields in the controller),
    // so values are stored as a flexible number map rather than fixed columns.
    values: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

// A customer can only have one measurement record per category —
// saving again for the same category updates it instead of duplicating it.
measurementSchema.index({ customer: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Measurement", measurementSchema);
