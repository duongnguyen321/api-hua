const fs = require("fs");
const path = require("path");
const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hardResetData = async (req, res) => {
  const adminName = req.headers.username;
  const adminPassword = req.headers.password;
  const accessToken = req.headers.authorization.split(" ")[1];
  if (!accessToken || !adminName || !adminPassword) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
  }
  const adminInfo = await router.db
    .get("users")
    .find({ username: adminName })
    .value();

  if (!adminInfo || adminInfo.role !== "admin") {
    return res
      .status(401)
      .json({ message: "Bạn không có quyền truy cập vào API này!" });
  }
  const passwordCurrentUserMatch = await bcrypt.compare(
    adminPassword,
    adminInfo.password
  );
  if (!passwordCurrentUserMatch) {
    return res.status(401).json({ message: "Mật khẩu của Admin không đúng!" });
  }

  const decoded = await jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET
  );
  if (!decoded) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
  }
  if (decoded.role !== adminInfo.role && decoded.userid !== adminInfo.id) {
    return res
      .status(401)
      .json({ message: "Bạn không có quyền truy cập vào API này!" });
  }
  try {
    const data = await fs.readFileSync(
      path.join(__dirname, "./data.json"),
      "utf8"
    );
    const imagesFolder = await fs.readdirSync(
      path.join(__dirname, "../../../../public/images")
    );
    const imagesNeedToDelete = async () => {
      const imageArr = [];
      await router.db
        .get("products")
        .value()
        .map(async (product) => {
          await product.images.map((image) => {
            if (!imageArr.includes(image.split("/")[2])) {
              imageArr.push(image.split("/")[2]);
            }
            return image.split("/")[2];
          });
          const imagesInNewData = await JSON.parse(data).products.map(
            (product) => {
              return product.images.map((image) => {
                const imageItem = image.split("/")[2];
                // delete image in imageArr if include
                if (imageArr.includes(imageItem)) {
                  const index = imageArr.indexOf(imageItem);
                  imageArr.splice(index, 1);
                }
                return imageItem;
              });
            }
          );
          const differentImages = imageArr.filter(
            (image) => !imagesInNewData.includes(image)
          );
          return differentImages;
        });
      return imageArr;
    };

    await imagesFolder.forEach(async (folder) => {
      const imagesNeedToDeleteInFolder = await imagesNeedToDelete();
      if (imagesNeedToDeleteInFolder.includes(folder)) {
        const folderPath = path.join(
          __dirname,
          `../../../../public/images/${folder}`
        );
        const files = await fs.readdirSync(folderPath);
        files.forEach(async (file) => {
          await fs.unlinkSync(`${folderPath}/${file}`);
        });
        await fs.rmdirSync(folderPath);
      }
    });
    console.log(data);
    await fs.writeFileSync(
      path.join(__dirname, "../../../../data/db.json"),
      data
    );
    res.status(200).json({ message: "Restore data thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Đã xảy ra lỗi khi restore data!" });
  }
};
module.exports = hardResetData;
