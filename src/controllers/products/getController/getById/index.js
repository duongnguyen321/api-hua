const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const getById = (req, res) => {
  const { id } = req.query;
  const product = router.db.get("products").find({ id }).value();
  if (!product) {
    res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
  } else {
    res
      .status(200)
      .json({ message: "Tìm sản phẩm thành công!", data: product });
  }
};
module.exports = getById;
