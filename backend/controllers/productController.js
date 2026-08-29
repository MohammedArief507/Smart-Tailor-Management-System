const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");

// Deletes an uploaded image file from disk (used when replacing/removing a product image)
const deleteImageFile = (imagePath) => {
  if (!imagePath) return;
  const fullPath = path.join(__dirname, "..", imagePath.replace(/^\//, ""));
  fs.unlink(fullPath, () => {}); // best-effort delete, ignore errors (e.g. file already gone)
};

// @route   GET /api/products
// @desc    List all products for the logged-in shop, optionally filtered by name
const getProducts = async (req, res) => {
  try {
    const { search } = req.query;
    const query = { owner: req.user.id };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Could not load products" });
  }
};

// @route   POST /api/products
// @desc    Create a product, with an optional image upload
const createProduct = async (req, res) => {
  try {
    const { name, price, costPrice } = req.body;

    if (!name || price === undefined || price === "") {
      return res.status(400).json({ message: "Please enter a product name and price" });
    }

    if (Number(price) < 0) {
      return res.status(400).json({ message: "Price cannot be negative" });
    }

    if (costPrice !== undefined && costPrice !== "" && Number(costPrice) < 0) {
      return res.status(400).json({ message: "Cost price cannot be negative" });
    }

    const image = req.file ? `/uploads/products/${req.file.filename}` : "";

    const product = await Product.create({
      owner: req.user.id,
      name,
      price: Number(price),
      costPrice: costPrice ? Number(costPrice) : 0,
      image,
    });

    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Could not create product" });
  }
};

// @route   PUT /api/products/:id
// @desc    Update a product's name, price, cost price, and/or image
const updateProduct = async (req, res) => {
  try {
    const { name, price, costPrice } = req.body;

    const product = await Product.findOne({ _id: req.params.id, owner: req.user.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (name) product.name = name;
    if (price !== undefined && price !== "") {
      if (Number(price) < 0) {
        return res.status(400).json({ message: "Price cannot be negative" });
      }
      product.price = Number(price);
    }
    if (costPrice !== undefined && costPrice !== "") {
      if (Number(costPrice) < 0) {
        return res.status(400).json({ message: "Cost price cannot be negative" });
      }
      product.costPrice = Number(costPrice);
    }

    if (req.file) {
      deleteImageFile(product.image); // remove the old image before saving the new one
      product.image = `/uploads/products/${req.file.filename}`;
    }

    await product.save();
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Could not update product" });
  }
};

// @route   DELETE /api/products/:id
// @desc    Delete a product and its image
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    deleteImageFile(product.image);
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete product" });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
