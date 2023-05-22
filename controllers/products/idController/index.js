const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const idController = (req, res) => {
  const { id } = req.params;
  const product = router.db.get("products").find({ id }).value();
  if (!product) {
    res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
  } else {
    res.json(product);
  }
};
module.exports = idController;
