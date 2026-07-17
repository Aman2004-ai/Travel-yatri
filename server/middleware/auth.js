const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "travelyatri-secret-key-998811";

// Middleware to strictly enforce authentication
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided, authorization denied" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// Middleware to optionally read user identity if token is present
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // Ignore token verification errors for optional authentication
    }
  }
  next();
};

module.exports = {
  requireAuth,
  optionalAuth,
  JWT_SECRET,
};
