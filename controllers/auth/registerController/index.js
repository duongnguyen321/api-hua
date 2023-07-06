const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const router = jsonServer.router("data/db.json");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const registerController = async (req, res) => {
  const { username, password, name, email, address, phone } = req.body;
  const existingUser = await router.db.get("users").find({ username }).value();
  if (existingUser) {
    res.status(409).json({
      message: "Tên đăng nhập đã tồn tại, vui lòng chọn tên đăng nhập khác!",
    });
    return;
  }
  const id = uuidv4();
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = {
    id,
    username,
    password: hashedPassword,
    name,
    email,
    address,
    phone,
    role: "user",
  };

  const accessToken = await generateAccessToken(user);
  const resetToken = await generateResetToken(user);

  try {
    await router.db.get("users").push(user).write();
    const { password: userPassword, ...userInfo } = user;
    res.json({
      message: "Đăng ký tài khoản thành công!",
      user: userInfo,
      accessToken,
      resetToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Đã xảy ra lỗi khi đăng ký tài khoản!" });
  }
};

const generateAccessToken = async (user) => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    accessTokenSecret,
    { expiresIn: "1w" }
  );
  return accessToken;
};

const generateResetToken = async (user) => {
  const resetTokenSecret = process.env.RESET_TOKEN_SECRET;
  const resetToken = jwt.sign({ userId: user.id }, resetTokenSecret, {
    expiresIn: "60 days",
  });
  return resetToken;
};
module.exports = registerController;
