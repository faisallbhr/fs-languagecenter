const jwt = require("jsonwebtoken");
const { apiError } = require("../utils");

exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new apiError(401, "Authentication token is required");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    throw new apiError(401, "Invalid or expired token");
  }
};
