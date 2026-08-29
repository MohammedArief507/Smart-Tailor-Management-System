const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

// @route   POST /api/transactions
// @desc    Save a bill. This is the main action of the Billing module —
//          saving a bill automatically creates a transaction record.
//          Prices/costs are always re-fetched from the database (never
//          trusted from the client) so amounts can't be tampered with.
const createTransaction = async (req, res) => {
  try {
    const { customerId, items, paymentMethod } = req.body;
    const ownerId = req.user.id;

    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: "Please select a customer" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Please add at least one product" });
    }

    if (!["Cash", "GPay"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Please choose a payment method" });
    }

    const customer = await Customer.findOne({ _id: customerId, owner: ownerId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds }, owner: ownerId });

    if (products.length !== productIds.length) {
      return res.status(400).json({ message: "One or more products could not be found" });
    }

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    let totalAmount = 0;
    let investmentAmount = 0;
    const billItems = items.map((item) => {
      const quantity = Number(item.quantity);
      if (!quantity || quantity < 1) {
        throw new Error("Each product must have a quantity of at least 1");
      }
      const product = productMap.get(item.productId);
      totalAmount += product.price * quantity;
      investmentAmount += (product.costPrice || 0) * quantity;

      return {
        product: product._id,
        name: product.name,
        price: product.price,
        cost: product.costPrice || 0,
        quantity,
      };
    });

    const transaction = await Transaction.create({
      owner: ownerId,
      customer: customer._id,
      items: billItems,
      totalAmount,
      investmentAmount,
      paymentMethod,
    });

    res.status(201).json({
      transaction: {
        id: transaction._id,
        customerName: customer.name,
        totalAmount: transaction.totalAmount,
        investmentAmount: transaction.investmentAmount,
        profit: transaction.totalAmount - transaction.investmentAmount,
        paymentMethod: transaction.paymentMethod,
        createdAt: transaction.createdAt,
      },
    });
  } catch (error) {
    res
      .status(error.message?.includes("quantity") ? 400 : 500)
      .json({ message: error.message || "Could not save the bill" });
  }
};

// @route   GET /api/transactions
// @desc    List saved transactions for the logged-in shop, with optional
//          search (by customer name/phone) and date filter (YYYY-MM-DD)
const getTransactions = async (req, res) => {
  try {
    const { search, date } = req.query;
    const ownerId = req.user.id;

    const query = { owner: ownerId };

    // Filter to a single calendar day if a date was given
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    // A shop's transaction history is small enough to fetch and filter in
    // memory — keeps the search logic simple (matches customer name/phone
    // or any item name) without needing a separate search index.
    let transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .populate("customer", "name phone");

    if (search) {
      const term = search.trim().toLowerCase();
      transactions = transactions.filter((txn) => {
        const customerMatch =
          txn.customer?.name?.toLowerCase().includes(term) ||
          txn.customer?.phone?.toLowerCase().includes(term);
        const itemMatch = txn.items.some((item) => item.name.toLowerCase().includes(term));
        return customerMatch || itemMatch;
      });
    }

    res.status(200).json({
      transactions: transactions.map((txn) => ({
        id: txn._id,
        customerName: txn.customer?.name || "Unknown Customer",
        customerPhone: txn.customer?.phone || "",
        items: txn.items,
        totalAmount: txn.totalAmount,
        investmentAmount: txn.investmentAmount || 0,
        profit: txn.totalAmount - (txn.investmentAmount || 0),
        paymentMethod: txn.paymentMethod,
        createdAt: txn.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Could not load transactions" });
  }
};

module.exports = { createTransaction, getTransactions };
