const getByType = require("./getByType");
const getById = require("./getById");

const getProductsController = (req, res) => {
  const { type, id } = req.query;
  if (type && id === undefined) {
    getByType(req, res);
  } else if (id && type === undefined) {
    getById(req, res);
  } else if (id && type) {
    getById(req, res);
  } else {
    res.status(400).json({
      message: "Không tìm thấy sản phẩm",
    });
  }
};
module.exports = getProductsController;
