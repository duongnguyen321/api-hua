const getByType = require("./getByType");
const getById = require("./getById");

const getProductsController = (req, res) => {
  const { type, id } = req.query;
  if (type && !id) {
    getByType(req, res);
  } else if (id && !type) {
    getById(req, res);
  } else if (id && type) {
    getById(req, res);
  } else {
    getByType(req, res);
  }
};
module.exports = getProductsController;
