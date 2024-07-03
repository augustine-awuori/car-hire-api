const Joi = require("joi");
const mongoose = require("mongoose");

const Booking = mongoose.model('Booking', new mongoose.Schema({
    booker: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    car: {
        type: mongoose.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    count: {
        type: Number,
        default: 1
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        default: function () {
            return this._id.getTimestamp();
        },
    },
}));

const validateBooking = (booking) =>
    Joi.object({
        booker: Joi.string(),
        car: Joi.string().required(),
        count: Joi.number(),
        endDate: Joi.string().required(),
        startDate: Joi.string().required(),
    }).validate(booking);

exports.Booking = Booking;
exports.validateBooking = validateBooking;
