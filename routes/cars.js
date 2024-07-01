const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { Car, validateCar } = require("../models/car");
const auth = require("../middlewares/auth");
const service = require('../services/car');
const validator = require("../middlewares/validate");

router.post("/", [auth, validator(validateCar)], async (req, res) => {
  const car = new Car({ ...req.body, lessee: req.user._id });

  await car.save();

  res.send(await service.findById(car._id));
});

router.get("/", async (_req, res) => {
  const cars = await service.getAll();

  res.send(cars);
});

router.get("/:carId", async (req, res) => {
  const carId = req.params.carId;

  if (!mongoose.isValidObjectId(carId))
    return res.status(400).send({ error: 'Invalid car id' });

  const car = await service.findById(carId);
  if (car) return res.send(car);

  res.status(404).send({ error: "The car with the given id doesn't exist" })
});

router.patch("/:carId", auth, async (req, res) => {
  const carId = req.params.carId;

  if (!mongoose.isValidObjectId(carId))
    return res.status(400).send({ error: "Invalid ID provided" });

  let car = await service.findById(carId);
  if (!car)
    return res
      .status(404)
      .send({ error: "The car with the given Id doesn't exist" });

  if (req.user._id.toString() !== car.lessee.toString())
    return res.status(403).send({ error: "This isn't your car" });

  res.send(await service.findByIdAndUpdate(carId, req.body, { new: true }));
});

module.exports = router;
