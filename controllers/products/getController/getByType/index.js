const _ = require("lodash");
const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const getByType = (req, res) => {
  const { type } = req.params;
  const { minPrice, maxPrice } = req.query;
  const data = _(router.db.get("products"))
    .filter((product) => type === "all" || product.type === type)
    .filter((product) => !minPrice || product.price >= minPrice)
    .filter((product) => !maxPrice || product.price <= maxPrice)
    .value();
  res.json(data);
};
module.exports = getByType;
