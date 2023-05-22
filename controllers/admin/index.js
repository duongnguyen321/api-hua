const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const admin = async (req, res) => {
  const { username, password, role, address, phone, name, email } = req.body;
  const currentUser = req.headers.user;
  const passswordCurrentUser = req.headers.password;
  if (!currentUser || !passswordCurrentUser) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
  }
  const currentUserInfo = router.db
    .get("users")
    .find({ username: currentUser })
    .value();
  if (!currentUserInfo || currentUserInfo.role !== "admin") {
    return res
      .status(401)
      .json({ message: "Bạn không có quyền truy cập vào API này!" });
  }
  const passswordCurrentUserMatch = await bcrypt.compare(
    passswordCurrentUser,
    currentUserInfo.password
  );
  if (!passswordCurrentUserMatch) {
    return res.status(401).json({ message: "Mật khẩu của Admin không đúng!" });
  }
  const existingAdmin = router.db
    .get("users")
    .find({ username, role: "admin" })
    .value();
  if (existingAdmin) {
    return res.status(409).json({ message: "Admin đã tồn tại!" });
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newAdmin = {
    id: uuidv4(),
    username,
    password: hashedPassword,
    address,
    email,
    phone,
    name,
    role,
  };
  try {
    await router.db.get("users").push(newAdmin).write();
    const { password: userPassword, ...userInfo } = newAdmin;
    res.json({ message: "Tạo admin mới thành công!", admin: userInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Đã xảy ra lỗi khi tạo admin mới!" });
  }
};
module.exports = admin;
