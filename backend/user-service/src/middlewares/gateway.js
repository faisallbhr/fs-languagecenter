const verifyGatewayAuthHeader = (req, res, next) => {
  const gatewayAuth = req.headers["x-gateway-auth"];

  if (gatewayAuth !== process.env.GATEWAY_SECRET) {
    return res.status(403).json({ message: "Forbidden: Invalid Gateway" });
  }

  next();
};

module.exports = verifyGatewayAuthHeader;
