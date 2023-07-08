const fs = require("fs");
const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const { checkAdmin, checkId } = require("../helpers");

const deleteProductController = async (req, res) => {
  const { userid } = req.headers;
  const { id } = req.query;
  try {
    if (!userid) {
      return res
        .status(401)
        .json({ message: "Bạn không có quyền thực hiện hành động này!" });
    }
    if (!checkAdmin(userid)) {
      return res
        .status(401)
        .json({ message: "Bạn không có quyền thực hiện hành động này!" });
    }
    if (!checkId(id)) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }
    const images = await router.db.get("products").find({ id }).value().images;
    await images.forEach((image) => {
      fs.unlinkSync(`public${image}`);
    });
    const folder = images[0].split("/")[2];
    const folderPath = `public/images/${folder}`;
    if (fs.readdirSync(folderPath).length === 0) {
      fs.rmdirSync(folderPath);
    }
    await router.db.get("products").remove({ id }).write();
    res.json({ message: "Xóa sản phẩm thành công!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Đã xảy ra lỗi khi xóa sản phẩm!" });
  }
};

module.exports = deleteProductController;
