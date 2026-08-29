const mongoose = require("mongoose");

const transactionItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    name: { type: String, required: true }, // snapshot of product name at time of sale
    price: { type: Number, required: true }, // snapshot of selling price at time of sale
    cost: { type: Number, default: 0 }, // snapshot of cost/investment price at time of sale
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const transactionSchema = new mongoose.Schema(
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
    items: {
      type: [transactionItemSchema],
      required: true,
      validate: (items) => items.length > 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    // Total cost/investment across all items — used to show Investment and
    // calculate Profit on the Transactions ledger.
    investmentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "GPay"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
