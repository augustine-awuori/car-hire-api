const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const _ = require("lodash");

const { User, validateUser } = require("../models/user");
const auth = require("../middlewares/auth");
const validator = require("../middlewares/validate");
const { default: mongoose } = require("mongoose");

router.post("/", validator(validateUser), async (req, res) => {
  const { email, name, password, phone } = req.body;
  let user = await User.findOne({ email });

  if (user) return res.status(400).send({ error: "Email is already taken" });

  user = new User({ name, email, password, phone });
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
  if (req.user._id.toString() !== userId.toString())
    return res.status(403).send({ error: "You're not authorised to access this account" })

  if (!mongoose.isValidObjectId(userId))
    return res.status(400).send({ error: 'Invalid user id' })

  const user = await User.findById(req.user._id);
  if (!user)
    return res.status(404).send({ error: "User doesn't exist in the database" })

  res.send(_.omit(user, 'password'));
});

router.get("/", async (_req, res) => {
  const users = await User.find({});

  res.send(users);
});

router.patch("/", auth, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  });

  if (user) return res.send(user);

  res.status(404).send({ error: "You don't exist in our database" });
});

module.exports = router;
