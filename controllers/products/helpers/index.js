const fs = require("fs");
const path = require("path");
const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");

const checkAdmin = async (id) => {
  const admin = await router.db
    .get("users")
    .find({ id, role: "admin" })
    .value();
  if (admin) {
    return true;
  }
};
const removeAccents = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};
const generateProductId = async (name) => {
  const id = await removeAccents(name.toLowerCase()).replace(/ /g, "-");
  const existingProduct = await router.db.get("products").find({ id }).value();
  if (existingProduct) {
    const number = Math.floor(Math.random() * parseInt(Date.now()));
    const newId = `${id}-${number}`;
    return newId;
  }
  return id;
};

const checkValidProduct = ({
  name,
  type,
  category,
  quantity,
  price,
  images,
}) => {
  let message = [];
  let status = 200;
  let isValid = true;
  if (!name) {
    message.push("Tên sản phẩm không được để trống!");
    status = 400;
    isValid = false;
  }
  if (!type) {
    message.push("Loại sản phẩm không được để trống!");
    status = 400;
    isValid = false;
  }
  if (!category) {
    message.push("Danh mục sản phẩm không được để trống!");
    status = 400;
    isValid = false;
  }
  if (!quantity || quantity === 0 || Number(quantity) === NaN) {
    message.push("Số lượng sản phẩm phải là số hoặc để trống!");
    status = 400;
    isValid = false;
  }
  if ((!price && price === 0) || Number(price) === NaN) {
    message.push("Giá sản phẩm phải là số hoặc để trống");
    status = 400;
    isValid = false;
  }
  if (images.length === 0) {
    message.push("Hình ảnh sản phẩm không được để trống!");
    status = 400;
    isValid = false;
  }
  return { message, status, isValid };
};

const uploadImages = async (images, id, name = "image") => {
  const folder = path.join(
    __dirname,
    `../../../public/images/${removeAccents(id.toLowerCase()).replace(
      / /g,
      "-"
    )}`
  );

  const processedImages = await Promise.all(
    images.map(async (img) => {
      try {
        const replaceType = img.replace(/^data:image\/\w+;base64,/, "");
        const imgBuffer = Buffer.from(replaceType, "base64");
        const imgType = img.split(";")[0].split("/")[1];
        const nameFile = removeAccents(name.toLowerCase()).replace(/ /g, "-");
        const rand = Math.floor(Math.random() * parseInt(Date.now()));
        const filename = `${nameFile}-${rand}.${imgType}`;
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder, { recursive: true });
        }
        const imagePath = path.join(folder, filename);
        await fs.writeFileSync(imagePath, imgBuffer);
        const folderName = folder.split("public")[1].replace(/\\/g, "/");
        return `${folderName}/${filename}`;
      } catch (error) {
        console.error("Có lỗi khi thêm hình ảnh:", error);
        return null;
      }
    })
  );

  const successImages = processedImages.filter((img) => img !== null);
  return { success: true, images: successImages };
};

const checkId = (id) => {
  const product = router.db.get("products").find({ id }).value();
  if (product) {
    return true;
  }
  return false;
};

module.exports = {
  checkAdmin,
  removeAccents,
  generateProductId,
  checkValidProduct,
  uploadImages,
  checkId,
};
