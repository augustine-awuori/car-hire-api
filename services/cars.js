const mongoose = require("mongoose");

const { Car } = require("../models/car");

const populateAndProject = (query) =>
    query.populate("lessee", "-password").populate("type");

const findById = async (id) => {
    if (mongoose.isValidObjectId(id))
        return await populateAndProject(Car.findById(id));
}

const getAll = async (filter = {}) =>
    await populateAndProject(Car.find(filter).sort("-_id"));

const findByIdAndUpdate = async (id, update, options) => {
    if (!mongoose.isValidObjectId(id)) return;

    return await populateAndProject(
        Car.findByIdAndUpdate(id, update, options)
    );
};

module.exports = { findById, findByIdAndUpdate, getAll, populateAndProject }