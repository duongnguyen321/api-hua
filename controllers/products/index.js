const { getByType, getById } = require("./getController");
const addProductController = require("./addController");
const updateProductController = require("./updateController");
const deleteProductController = require("./deleteController");
module.exports = {
  getByType,
  getById,
  addProductController,
  updateProductController,
  deleteProductController,
};
