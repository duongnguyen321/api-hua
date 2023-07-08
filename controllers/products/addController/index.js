const fs = require("fs");
const path = require("path");
const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const {
  checkAdmin,
  generateProductId,
  checkValidProduct,
  uploadImages,
} = require("../helpers");

const addProductController = async (req, res) => {
  const { userid } = req.headers;
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
  const { name, type, category, quantity, price, images } = req.body;
  try {
    const { message, status, isValid } = checkValidProduct({
      name,
      type,
      category,
      quantity,
      price,
      images,
    });
    if (!isValid) {
      return res.status(status).json({ message });
    }
    const id = await generateProductId(name);

    const isUploadImages = await uploadImages(images, id, name);
    if (!isUploadImages.success) {
      return res.status(400).json({ message: "Đã xảy ra lỗi khi thêm!" });
    }
    if (isUploadImages.images.length === 0) {
      return res.status(400).json({ message: "Đã xảy ra lỗi khi thêm!" });
    }
    const newProduct = {
      id,
      name,
      type,
      category,
      quantity: parseInt(quantity),
      price: parseInt(price),
      images: isUploadImages.images,
    };
    await router.db.get("products").push(newProduct).write();
    res.json({ message: "Thêm sản phẩm mới thành công!", product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Đã xảy ra lỗi khi thêm sản phẩm!" });
  }
};

module.exports = addProductController;
