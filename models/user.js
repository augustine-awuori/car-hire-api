const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const schema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,
    trim: true,
    minlength: 7,
    maxlength: 14,
    required: true,
  },
  photo: String,
  name: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 50,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
    trim: true,
  },
  kra: String,
  backId: String,
  frontId: String,
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  isAdmin: { type: Boolean, default: false },
  id: { type: String, required: true },
  timestamp: {
    type: Number,
    default: function () {
      return this._id.getTimestamp();
    },
  },
  kraPin: { type: String, required: true },
  bookedCars: Object,
  approved: { type: Boolean, default: false },
  blocked: { type: Boolean, default: false },
  approvedBy: { type: mongoose.Types.ObjectId, ref: 'User' }
});

schema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, name: this.name, email: this.email, isAdmin: this.isAdmin },
    process.env.jwtPrivateKey
  );
};

const User = mongoose.model("User", schema);

const validateUser = (user) =>
  Joi.object({
    email: Joi.string().min(3).max(100).required(),
    id: Joi.string().max(13).required(),
    kraPin: Joi.string().required(),
    name: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).max(1024).required(),
    phone: Joi.string().min(7).max(14).required(),
  }).validate(user);

exports.User = User;
exports.validateUser = validateUser;
