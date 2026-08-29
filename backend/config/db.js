const mongoose = require("mongoose");

// Connects to MongoDB — either a local server (via MongoDB Compass) or
// MongoDB Atlas, depending on what MONGO_URI in .env points to.
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error(
      "Check that MongoDB is running locally (see it in MongoDB Compass) " +
        "or, if using Atlas, see the README's Backend Setup section for " +
        "the 'Legacy URI String' fix for querySrv errors on Windows."
    );
    // Stop the server if the database connection fails
    process.exit(1);
  }
};

module.exports = connectDB;
