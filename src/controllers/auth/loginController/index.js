const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const bcrypt = require("bcryptjs");
const { generateAccessToken, generateResetToken } = require("../helper");

const loginController = async (req, res) => {
  const { username, password } = req.body;
  const user = router.db.get("users").find({ username }).value();
  if (!user) {
    return res
      .status(401)
      .json({ message: "Đăng nhập không thành công, vui lòng thử lại!" });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res
      .status(401)
      .json({ message: "Đăng nhập không thành công, vui lòng thử lại!" });
  }
  const { password: userPassword, ...userInfo } = user;

  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateResetToken(user);
  res.status(200).json({
    message: "Đăng nhập thành công!",
    user: userInfo,
    accessToken,
    refreshToken,
  });
};
module.exports = loginController;
