const Customer = require("../models/Customer");

// @route   GET /api/customers
// @desc    List/search customers for the logged-in shop, by name or phone
const getCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    const query = { owner: req.user.id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 });
    res.status(200).json({ customers });
  } catch (error) {
    res.status(500).json({ message: "Could not load customers" });
  }
};

// @route   POST /api/customers
// @desc    Create a customer
// NOTE: this is used by both the Billing "quick add" flow and the full
// Customers module. Editing is completed in the full Customers module.
const createCustomer = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Please enter a name and phone number" });
    }

    const customer = await Customer.create({
      owner: req.user.id,
      name,
      phone,
      address: address || "",
    });

    res.status(201).json({ customer });
  } catch (error) {
    res.status(500).json({ message: "Could not create customer" });
  }
};

// @route   PUT /api/customers/:id
// @desc    Update a customer's name, phone, and/or address
const updateCustomer = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const customer = await Customer.findOne({ _id: req.params.id, owner: req.user.id });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (name) customer.name = name;
    if (phone) customer.phone = phone;
    if (address !== undefined) customer.address = address;

    await customer.save();
    res.status(200).json({ customer });
  } catch (error) {
    res.status(500).json({ message: "Could not update customer" });
  }
};

module.exports = { getCustomers, createCustomer, updateCustomer };
