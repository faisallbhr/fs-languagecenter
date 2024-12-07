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

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new apiError(
        403,
        "You do not have permission to access this resource"
      );
    }
    next();
  };
};
