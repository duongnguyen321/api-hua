const typeController = (req, res, _, router) => {
  const { type } = req.params;
  const { minPrice, maxPrice } = req.query;
  const data = _(router.db.get("products"))
    .filter((product) => type === "all" || product.type === type)
    .filter((product) => !minPrice || product.price >= minPrice)
    .filter((product) => !maxPrice || product.price <= maxPrice)
    .value();
  res.json(data);
};
module.exports = typeController;
