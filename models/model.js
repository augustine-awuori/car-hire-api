const Joi = require("joi");
const mongoose = require("mongoose");

const Model = mongoose.model("Model", new mongoose.Schema({
    type: {
        ref: 'Type',
        required: true,
        type: mongoose.Types.ObjectId,
    },
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
        type: Joi.string().required()
    }).validate(model);

exports.Model = Model;
exports.validate = validate;
