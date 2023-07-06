const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const router = jsonServer.router("data/db.json");
const bcrypt = require("bcryptjs");
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
  res.json({
    message: "Đăng nhập thành công!",
    user: userInfo,
    accessToken,
  });
};
const generateAccessToken = async (user) => {
  const accessTokenSecret = await process.env.ACCESS_TOKEN_SECRET;
  const accessToken = await jwt.sign(
    { userId: user.id, role: user.role },
    accessTokenSecret,
    { expiresIn: "1w" }
  );
  return accessToken;
};
module.exports = loginController;
