const cors = require("cors");
const express = require("express");
const serveStatic = require("serve-static");

const auth = require("../routes/auth");
const bookings = require("../routes/bookings");
const cars = require("../routes/cars");
const error = require("../middlewares/error");
const models = require("../routes/models");
const types = require("../routes/types");
const users = require("../routes/users");

module.exports = function (app) {
  app.use(express.json());
  app.use(serveStatic("public", { acceptRanges: false }));
  app.use(cors({ origin: "*" }));
  app.use("/api/auth", auth);
  app.use("/api/bookings", bookings);
  app.use("/api/cars", cars);
  app.use("/api/models", models);
  app.use("/api/types", types);
  app.use("/api/users", users);
  app.use(error);
};
