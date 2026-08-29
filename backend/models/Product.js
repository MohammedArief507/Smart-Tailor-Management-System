const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },
    // What the shop paid to make/source this product — used to calculate
    // Investment and Profit on the Bill and Transactions pages.
    costPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String, // stored file path/URL, e.g. /uploads/products/xyz.jpg
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
