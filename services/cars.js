
const populateAndProject = (query) => query.populate("lessee", "-password");

module.exports = { populateAndProject }
