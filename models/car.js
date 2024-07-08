const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  selfDrive: {
    type: Boolean,
    required: true,
  },
  mileage: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  lessee: {
    required: true,
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  plate: {
    type: String,
    required: true,
    maxlength: 10,
    minlength: 7,
    trim: true,
  },
  type: {
    ref: 'Type',
    required: true,
    type: mongoose.Types.ObjectId,
  },
  model: {
    ref: 'Model',
    required: true,
    type: mongoose.Types.ObjectId,
  },
  year: {
    required: true,
    type: Number,
  },
  images: [String],
  license: String,
  logBook: String,
  saleAgreement: String,
  location: String,
  withDriver: {
    default: false,
    type: Boolean
  },
  count: {
    type: Number,
    required: true
  },
  cc: {
    type: Number,
    required: true
  },
});

const Car = mongoose.model("Car", schema);

const validateCar = (car) =>
  Joi.object({
    cc: Joi.number().required(),
    count: Joi.number().required(),
    images: Joi.array().min(1),
    name: Joi.string().required(),
    plate: Joi.string().required(),
    selfDrive: Joi.boolean().required(),
    location: Joi.string().required(),
    model: Joi.string().required(),
    type: Joi.string().required(),
    withDriver: Joi.boolean().required(),
    year: Joi.number().required(),
  }).validate(car);

exports.Car = Car;
exports.validateCar = validateCar;
