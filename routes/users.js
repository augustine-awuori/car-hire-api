const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const mongoose = require("mongoose");
const _ = require("lodash");

const { User, validateUser } = require("../models/user");
const auth = require("../middlewares/auth");
const validator = require("../middlewares/validate");

router.post("/", validator(validateUser), async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send({ error: "Email is already taken" });

  user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  res
    .header("x-auth-token", user.generateAuthToken())
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email"]));
});

router.get("/:userId", auth, async (req, res) => {
  const userId = req.params.userId;
  if (req.user._id.toString() !== userId.toString() && !req.user.isAdmin)
    return res.status(403).send({ error: "You're not authorised to access this account" })

  if (!mongoose.isValidObjectId(userId))
    return res.status(400).send({ error: 'Invalid user id' })

  const user = await User.findById(userId);
  if (!user)
    return res.status(404).send({ error: "User doesn't exist in the database" })

  res.send(_.omit(user, 'password'));
});

router.get("/", async (_req, res) => {
  const users = await User.find({});

  res.send(users);
});

router.patch("/", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).send({ error: "User don't exist in our database" });

  if (user._id.toString() !== req.user._id && !req.user.isAdmin)
    return res.status(403).send({ error: 'You are not authorised for this operation' });

  const data = { ...req.body };
  if (data.approved) data.approvedBy = req.user._id;

  const updatedUser = await User.findByIdAndUpdate(user._id, data, { new: true });
  res.send(updatedUser);
});

module.exports = router;
