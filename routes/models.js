const express = require("express");
const router = express.Router();

const { Model, validate } = require("../models/model");
const admin = require('../middlewares/admin');
const auth = require('../middlewares/auth');
const service = require('../services/model');
const validatingWith = require('../middlewares/validate');

router.post("/", [auth, admin, validatingWith(validate)], async (req, res) => {
    const model = new Model({ ...req.body });

    await model.save();

    res.send(await service.findById(model._id));
});

router.get("/", async (_req, res) => {
    const models = await service.getAll();
    console.log("models", models)
    res.send(models);
});

module.exports = router;