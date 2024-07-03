const mongoose = require("mongoose");

const { User } = require("../models/user");

const findById = async (id) => {
    if (mongoose.isValidObjectId(id))
        return await User.findById(id);
}

const getAll = async (filter = {}) =>
    await User.find(filter).sort("-_id");

const findByIdAndUpdate = async (id, update, options) => {
    if (!mongoose.isValidObjectId(id)) return;

    return await User.findByIdAndUpdate(id, update, options);
};

module.exports = { findById, findByIdAndUpdate, getAll, }