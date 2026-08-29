const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper to create a signed JWT token for a given user id
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @route   POST /api/auth/register
// @desc    Create a new shop owner account
const registerUser = async (req, res) => {
  try {
    const { shopName, ownerName, phone, email, password } = req.body;

    if (!shopName || !ownerName || !phone || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      shopName,
      ownerName,
      phone,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        shopName: user.shopName,
        ownerName: user.ownerName,
        phone: user.phone,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// @route   POST /api/auth/login
// @desc    Log in an existing shop owner
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter email and password" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        shopName: user.shopName,
        ownerName: user.ownerName,
        phone: user.phone,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// @route   GET /api/auth/me
// @desc    Get the logged-in user's own profile (used to keep session alive)
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// @route   PUT /api/auth/profile
// @desc    Update the logged-in user's shop name, owner name, and phone number
const updateProfile = async (req, res) => {
  try {
    const { shopName, ownerName, phone } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (shopName) user.shopName = shopName;
    if (ownerName) user.ownerName = ownerName;
    if (phone) user.phone = phone;

    await user.save();

    res.status(200).json({
      user: {
        id: user._id,
        shopName: user.shopName,
        ownerName: user.ownerName,
        phone: user.phone,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Could not update profile" });
  }
};

module.exports = { registerUser, loginUser, getMe, updateProfile };
