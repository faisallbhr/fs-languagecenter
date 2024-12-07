const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middlewares/errorHandler");
const verifyGatewayAuthHeader = require("./middlewares/gateway");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();
app.use(express.json());
app.use(verifyGatewayAuthHeader);

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Users Service DB Connected"))
  .catch((err) => console.log(err));

app.use("/api/user", userRoutes);
app.use(errorHandler);

module.exports = app;
