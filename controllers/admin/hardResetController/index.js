const fs = require("fs");
const path = require("path");
const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const bcrypt = require("bcryptjs");

const hardResetData = async (req, res) => {
  const adminName = req.headers.user;
  const adminPassword = req.headers.password;
  if (!adminName || !adminPassword) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
  }
  const adminInfo = router.db
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
  try {
    const data = await fs.readFileSync("./data.json", "utf8");
    const imagesFolder = await fs.readdirSync(
      path.join(__dirname, "../../../public/images")
    );
    const imagesNeedToDelete = await router.db
      .get("products")
      .value()
      .map((product) => {
        const imagesInDb = product.images.map((image) => {
          return image.split("/")[2];
        });
        const imagesInNewData = JSON.parse(data).products.map((product) => {
          return product.images.map((image) => {
            return image.split("/")[2];
          });
        });
        const differentImages = imagesInDb.filter((image) => {
          return imagesInNewData.includes(image);
        });
        return differentImages;
      })
      .flat();
    imagesFolder.forEach(async (folder) => {
      if (!imagesNeedToDelete.includes(folder)) {
        const folderPath = path.join(
          __dirname,
          `../../../public/images/${folder}`
        );
        const files = await fs.readdirSync(folderPath);
        files.forEach(async (file) => {
          await fs.unlinkSync(`${folderPath}/${file}`);
        });
        await fs.rmdirSync(folderPath);
      }
    });
    await fs.writeFileSync("./data.json", data);
    await router.db.setState(JSON.parse(data));
    res.status(200).json({ message: "Restore data thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Đã xảy ra lỗi khi restore data!" });
  }
};
module.exports = hardResetData;
