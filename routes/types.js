const express = require("express");
const router = express.Router();

const { Type, validate } = require("../models/type");
const admin = require('../middlewares/admin');
const auth = require('../middlewares/auth');
const validatingWith = require('../middlewares/validate');

router.post("/", [auth, admin, validatingWith(validate)], async (req, res) => {
    const type = new Type({ label: req.body.label });

    await type.save();

    res.send(type);
});

router.get("/", async (_req, res) => {
    const types = await Type.find({}).sort("_id");

    res.send(types);
});

module.exports = router;