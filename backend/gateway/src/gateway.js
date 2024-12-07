const addGatewayAuthHeader = (req, res, next) => {
  req.headers["x-gateway-auth"] = process.env.GATEWAY_SECRET;
  next();
};

module.exports = addGatewayAuthHeader;
