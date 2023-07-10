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
      path.join(__dirname, "./data/data.json"),
      "utf8"
    );
    await fs.writeFileSync(
      path.join(__dirname, "../../../../data/db.json"),
      data
    );
    const pathImagesPublic = path.join(__dirname, `../../../../public/images`);
    const restoreData = async (folder) => {
      const pathImagePublic = path.join(
        __dirname,
        `../../../../public/images/${folder}`
      );
      const pathImage = path.join(__dirname, `./data/images/${folder}`);
      if (!fs.existsSync(pathImagesPublic)) {
        await fs.mkdirSync(path.join(pathImagesPublic));
      }
      if (!fs.existsSync(pathImagePublic)) {
        await fs.mkdirSync(path.join(pathImagePublic));
      }
      const imagesInFolder = await fs.readdirSync(pathImage, "utf8");
      await imagesInFolder.forEach(async (image) => {
        const pathImageInFolder = path.join(pathImage, `/${image}`);
        const pathImageInFolderPublic = path.join(pathImagePublic, `/${image}`);
        await fs.copyFileSync(pathImageInFolder, pathImageInFolderPublic);
      });
    };
    const imagesFolder = await fs.readdirSync(
      path.join(__dirname, "./data/images"),
      "utf8"
    );
    const ImagesNeedDelete = await fs.readdirSync(pathImagesPublic, "utf8");
    await ImagesNeedDelete.forEach(async (folder) => {
      if (!imagesFolder.includes(folder)) {
        const folderPath = path.join(pathImagesPublic, `/${folder}`);
        const imagesInFolder = await fs.readdirSync(folderPath, "utf8");
        await imagesInFolder.forEach(async (image) => {
          const pathImageInFolder = path.join(folderPath, `/${image}`);
          await fs.unlinkSync(pathImageInFolder);
        });
        await fs.rmdirSync(folderPath);
      }
    });
    await imagesFolder.forEach(async (folder) => {
      await restoreData(folder);
    });

    return res.status(200).json({ message: "Restore data thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Đã xảy ra lỗi khi restore data!" });
  }
};
module.exports = hardResetData;
