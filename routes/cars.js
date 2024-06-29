const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

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

router.get("/:carId", async (req, res) => {
  const carId = req.params.carId;

  if (!mongoose.isValidObjectId(carId))
    return res.status(400).send({ error: 'Invalid car id' });

  const car = await Car.findById(carId);
  if (!car) return res.status(404).send({ error: "The car with the given id doesn't exist" })

  res.send(await car.populate('lessee'));
});

router.patch("/:carId", auth, async (req, res) => {
  const carId = req.params.carId;

  if (!mongoose.isValidObjectId(carId))
    return res.status(400).send({ error: "Invalid ID provided" });

  let car = await Car.findById(carId);
  if (!car)
    return res
      .status(404)
      .send({ error: "The car with the given Id doesn't exist" });

  if (req.user._id.toString() !== car.lessee.toString())
    return res.status(403).send({ error: "This isn't your car" });

  car = await Car.findByIdAndUpdate(carId, req.body, { new: true }).populate(
    "lessee"
  );
  res.send(car);
});

module.exports = router;
