const Customer = require("../models/Customer");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");

// @route   GET /api/dashboard
// @desc    Returns today's income, today's bill count, total customers,
//          total products, and the most recent transactions for the logged-in shop
const getDashboardData = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Start and end of today (server local time)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [todayTransactions, totalCustomers, totalProducts, recentTransactions] =
      await Promise.all([
        Transaction.find({
          owner: ownerId,
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        }),
        Customer.countDocuments({ owner: ownerId }),
        Product.countDocuments({ owner: ownerId }),
        Transaction.find({ owner: ownerId })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate("customer", "name phone"),
      ]);

    const todayIncome = todayTransactions.reduce(
      (sum, txn) => sum + txn.totalAmount,
      0
    );

    res.status(200).json({
      todayIncome,
      todayBills: todayTransactions.length,
      totalCustomers,
      totalProducts,
      recentTransactions: recentTransactions.map((txn) => ({
        id: txn._id,
        customerName: txn.customer?.name || "Unknown Customer",
        totalAmount: txn.totalAmount,
        paymentMethod: txn.paymentMethod,
        createdAt: txn.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Could not load dashboard data" });
  }
};

module.exports = { getDashboardData };
