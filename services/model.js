const mongoose = require("mongoose");

const { Model } = require("../models/model");

const populateAndProject = (query) => query.populate("type");

const findById = async (id) => {
    if (mongoose.isValidObjectId(id))
        return await populateAndProject(Model.findById(id));
}

const getAll = async (filter = {}) =>
    await populateAndProject(Model.find(filter).sort("-_id"));

const findByIdAndUpdate = async (id, update, options) => {
    if (!mongoose.isValidObjectId(id)) return;

    return await populateAndProject(
        Model.findByIdAndUpdate(id, update, options)
    );
};

module.exports = { findById, findByIdAndUpdate, getAll, populateAndProject }