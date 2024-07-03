const mongoose = require("mongoose");

const { Booking } = require("../models/booking");

const populateAndProject = (query) =>
    query.populate("booker", "-password").populate("car");

const findById = async (id) => {
    if (mongoose.isValidObjectId(id))
        return await populateAndProject(Booking.findById(id));
}

const getAll = async (filter = {}) =>
    await populateAndProject(Booking.find(filter).sort("-_id"));

const findByIdAndUpdate = async (id, update, options) => {
    if (!mongoose.isValidObjectId(id)) return;

    return await populateAndProject(
        Booking.findByIdAndUpdate(id, update, options)
    );
};

module.exports = { findById, findByIdAndUpdate, getAll, populateAndProject }