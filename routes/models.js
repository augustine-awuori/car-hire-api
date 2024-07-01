const express = require("express");
const router = express.Router();

const { Model, validate } = require("../models/model");
const admin = require('../middlewares/admin');
const auth = require('../middlewares/auth');
const validatingWith = require('../middlewares/validate');

router.post("/", [auth, admin, validatingWith(validate)], async (req, res) => {
    const model = new Model({ label: req.body.label });

    await model.save();

    res.send(model);
});

router.get("/", async (_req, res) => {
    const models = await Model.find({}).sort("_id");

    res.send(models);
});

module.exports = router;