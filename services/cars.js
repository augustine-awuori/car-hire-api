const mongoose = require("mongoose");

const { Car } = require("../models/car");

const populateAndProject = (query) =>
    query.populate("lessee", "-password").populate("type");

const findById = async (id) => {
    if (mongoose.isValidObjectId(id))
        return await populateAndProject(Car.findById(id));
}

module.exports = { findById, populateAndProject }
