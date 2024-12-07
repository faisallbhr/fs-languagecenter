const express = require("express");
const httpProxy = require("http-proxy");
const addGatewayAuthHeader = require("./gateway");
const cors = require("cors");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();
app.use(cors());
const proxy = httpProxy.createProxyServer();

const routes = {
  "/api/user": process.env.USER_SERVICE_URL,
  "/api/leave": process.env.LEAVE_SERVICE_URL,
};

app.use(addGatewayAuthHeader);

app.use((req, res) => {
  const target = Object.keys(routes).find((route) => req.url.startsWith(route));
  if (target) {
    proxy.web(req, res, { target: routes[target] });
  } else {
    res.status(404).json({ error: "Service not found" });
  }
});

app.listen(process.env.PORT || 5000, () =>
  console.log("API Gateway running on port 5000")
);
