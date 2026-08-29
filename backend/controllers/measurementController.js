const mongoose = require("mongoose");
const Measurement = require("../models/Measurement");
const Customer = require("../models/Customer");

// The exact field set allowed for each measurement category.
// Keep this in sync with MEASUREMENT_FIELDS on the frontend.
const CATEGORY_FIELDS = {
  Blouse: [
    "shoulder",
    "bust",
    "waist",
    "hip",
    "sleeve",
    "neck",
    "length",
    "armRound",
    "frontNeck",
    "backNeck",
  ],
  Chudithar: ["shoulder", "bust", "waist", "hip", "sleeve", "topLength", "pantLength"],
  Pant: ["waist", "hip", "thigh", "knee", "bottom", "length"],
};

// @route   GET /api/measurements/:customerId
// @desc    Get all saved measurements (one per category) for a customer
const getMeasurementsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const ownerId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: "Invalid customer" });
    }

    const customer = await Customer.findOne({ _id: customerId, owner: ownerId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const measurements = await Measurement.find({ customer: customerId, owner: ownerId });

    // Return as { Blouse: {...}, Chudithar: {...}, Pant: {...} } for easy lookup on the frontend
    const byCategory = {};
    measurements.forEach((m) => {
      byCategory[m.category] = Object.fromEntries(m.values);
    });

    res.status(200).json({ measurements: byCategory });
  } catch (error) {
    res.status(500).json({ message: "Could not load measurements" });
  }
};

// @route   POST /api/measurements
// @desc    Save (create or update) a customer's measurements for one category
const saveMeasurement = async (req, res) => {
  try {
    const { customerId, category, values } = req.body;
    const ownerId = req.user.id;

    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: "Please select a customer" });
    }

    if (!CATEGORY_FIELDS[category]) {
      return res.status(400).json({ message: "Invalid measurement category" });
    }

    const customer = await Customer.findOne({ _id: customerId, owner: ownerId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Only keep known fields for this category, and only if a real number was given
    const allowedFields = CATEGORY_FIELDS[category];
    const cleanValues = {};
    allowedFields.forEach((field) => {
      const raw = values?.[field];
      if (raw !== undefined && raw !== null && raw !== "") {
        const num = Number(raw);
        if (!Number.isNaN(num)) cleanValues[field] = num;
      }
    });

    const measurement = await Measurement.findOneAndUpdate(
      { owner: ownerId, customer: customerId, category },
      { owner: ownerId, customer: customerId, category, values: cleanValues },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      category: measurement.category,
      values: Object.fromEntries(measurement.values),
    });
  } catch (error) {
    res.status(500).json({ message: "Could not save measurements" });
  }
};

// @route   GET /api/measurements/category/:category
// @desc    List customers who have a saved measurement for one category —
//          powers the "customer list" screen shown after picking Blouse /
//          Chudithar / Pant, with an optional name search.
const getMeasurementsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { search } = req.query;
    const ownerId = req.user.id;

    if (!CATEGORY_FIELDS[category]) {
      return res.status(400).json({ message: "Invalid measurement category" });
    }

    let measurements = await Measurement.find({ owner: ownerId, category })
      .sort({ updatedAt: -1 })
      .populate("customer", "name phone");

    if (search) {
      const term = search.trim().toLowerCase();
      measurements = measurements.filter((m) => m.customer?.name?.toLowerCase().includes(term));
    }

    res.status(200).json({
      entries: measurements
        .filter((m) => m.customer) // skip any orphaned records safely
        .map((m) => ({
          customerId: m.customer._id,
          customerName: m.customer.name,
          customerPhone: m.customer.phone,
          updatedAt: m.updatedAt,
        })),
    });
  } catch (error) {
    res.status(500).json({ message: "Could not load measurements" });
  }
};

module.exports = { getMeasurementsByCustomer, getMeasurementsByCategory, saveMeasurement };
