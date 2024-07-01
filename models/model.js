const Joi = require("joi");
const mongoose = require("mongoose");

const Model = mongoose.model("Model", new mongoose.Schema({
    label: {
        max: 50,
        min: 3,
        required: true,
        trim: true,
        type: String,
        unique: true,
    }
}));

const validate = (model) =>
    Joi.object({
        label: Joi.string().min(3).max(50).required(),
    }).validate(model);

exports.Model = Model;
exports.validate = validate;
