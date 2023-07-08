const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const { uploadImages, checkId } = require("../helpers");

const updateProductController = async (req, res) => {
  const { id } = req.query;
  const {
    name = "",
    type = "",
    category = "",
    quantity = 0,
    price = 0,
    images = [],
    ratings = [],
    sales = [],
  } = req.body;
  try {
    if (!checkId(id)) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }
    const prevData = router.db.get("products").find({ id }).value();
    if (!prevData) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }
    const newData = {};
    if (name && name !== prevData.name) {
      newData.name = name;
    }
    if (type && type !== prevData.type) {
      newData.type = type;
    }
    if (category && category !== prevData.category) {
      newData.category = category;
    }
    if (quantity && quantity !== prevData.quantity) {
      const isNumber = Number(quantity);
      if (isNaN(isNumber)) {
        return res.status(400).json({ message: "Số lượng phải là số!" });
      }
      newData.quantity = quantity;
    }
    if (price && price !== prevData.price) {
      const isNumber = Number(price);
      if (isNaN(isNumber)) {
        return res.status(400).json({ message: "Giá phải là số!" });
      }

      newData.price = price;
    }
    if (images && Array.isArray(images) && images.length > 0) {
      if (images !== prevData.images) {
        newData.images = images;
      } else {
        const isUploadImages = await uploadImages(images, id, name);
        if (!isUploadImages.success) {
          return res
            .status(400)
            .json({ message: "Đã xảy ra lỗi khi cập nhật!" });
        }
        if (isUploadImages.images.length === 0) {
          return res.status(400).json({ message: "Đã xảy ra lỗi khi thêm!" });
        }
        const fs = require("fs");
        const path = require("path");
        const oldImages = prevData.images;
        oldImages.forEach((image) => {
          const imagePath = path.join(__dirname, `../../../public/${image}`);
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error(err);
            }
          });
        });
        newData.images = isUploadImages.images;
      }
    }
    if (ratings && Array.isArray(ratings) && ratings.length > 0) {
      if (ratings !== prevData.ratings) newData.ratings = ratings;
    }
    if (sales && Array.isArray(sales) && sales.length > 0) {
      if (sales !== prevData.sales) newData.sales = sales;
    }
    if (Object.keys(newData).length === 0) {
      return res.status(400).json({ message: "Không có gì để cập nhật!" });
    }
    if (typeof newData.quantity === "string") {
      const isNumber = Number(newData.quantity);
      if (isNaN(isNumber)) {
        return res.status(400).json({ message: "Số lượng phải là số!" });
      }
      newData.quantity = isNumber;
    }
    if (typeof newData.price === "string") {
      const isNumber = Number(newData.price);
      if (isNaN(isNumber)) {
        return res.status(400).json({ message: "Giá phải là số!" });
      }
      newData.price = isNumber;
    }

    const data = await router.db
      .get("products")
      .find({ id })
      .assign(newData)
      .write();
    return res
      .status(200)
      .json({ message: "Cập nhật sản phẩm thành công!", product: data });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Đã xảy ra lỗi khi cập nhật sản phẩm!" });
  }
};

module.exports = updateProductController;
