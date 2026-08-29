const jwt = require("jsonwebtoken");

// Protects routes by verifying the JWT token sent in the Authorization header
const protect = (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id };
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
  }

  return res.status(401).json({ message: "Not authorized. Please log in." });
};

module.exports = { protect };
