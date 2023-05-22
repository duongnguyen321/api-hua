const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const getController = (req, res) => {
  const { id } = req.params;
  const user = router.db.get("users").find({ id }).omit(["password"]).value();
  if (!user) {
    res.status(404).json({ message: "Không tìm thấy người dùng!" });
  } else {
    res.json(user);
  }
};
module.exports = getController;
