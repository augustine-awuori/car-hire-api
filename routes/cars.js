const express = require("express");
const router = express.Router();

const { Car, validateCar } = require("../models/car.js");
const auth = require("../middlewares/auth");
const validator = require("../middlewares/validate");

router.post("/", [auth, validator(validateCar)], async (req, res) => {
  const { name, fuel, mileage, model, plate, selfDrive, type, year, images } =
    req.body;

  const car = new Car({
    name,
    fuel,
    lessee: req.user._id,
    mileage,
    model,
    images,
    plate,
    selfDrive,
    type,
    year,
  });

  await car.save();

  res.send(car);
});

router.get("/", async (_req, res) => {
  const cars = await Car.find({});

  res.send(cars);
});

module.exports = router;
