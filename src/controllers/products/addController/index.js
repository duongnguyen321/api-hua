const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const router = jsonServer.router("data/db.json");
const {
  generateProductId,
  checkValidProduct,
  uploadImages,
} = require("../helpers");

const addProductController = async (req, res) => {
  const { name, type, category, quantity, price, images } = req.body;
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).json({ message: "Access token không hợp lệ!" });
  }
  const accessToken = authorization.split(" ")[1];
  if (!accessToken) {
    return res.status(400).json({ message: "Access token không hợp lệ!" });
  }
  const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

  if (!decoded) {
    return res.status(400).json({ message: "Access token không hợp lệ!" });
  }
  const user = await router.db
    .get("users")
    .find({ id: decoded.userid })
    .value();
  if (!user) {
    return res.status(400).json({ message: "Access token không hợp lệ!" });
  }

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
    res
      .status(200)
      .json({ message: "Thêm sản phẩm mới thành công!", product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Đã xảy ra lỗi khi thêm sản phẩm!" });
  }
};

module.exports = addProductController;

