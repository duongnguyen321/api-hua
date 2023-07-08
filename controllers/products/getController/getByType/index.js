const _ = require("lodash");
const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const getByType = (req, res) => {
  const { type, minPrice, maxPrice } = req.query;
  const data = _(router.db.get("products"))
    .filter((product) => type === "all" || product.type === type)
    .filter((product) => !minPrice || product.price >= minPrice)
    .filter((product) => !maxPrice || product.price <= maxPrice)
    .value();
  res.status(200).json({ message: "Tìm sản phẩm thành công!", data });
};
module.exports = getByType;
