const mongoose = require("mongoose");

const populateAndProject = (query) =>
    query.populate("lessee", "-password").populate("type");

const findById = (id) => {
    if (!mongoose.isValidObjectId(id))
        return
}

module.exports = { findById, populateAndProject }
