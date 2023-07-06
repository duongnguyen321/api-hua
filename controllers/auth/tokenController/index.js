const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const jwt = require("jsonwebtoken");

const autoLoginController = async (req, res) => {
  const accessTokenBearer = req.headers.authorization;

  const accessToken = accessTokenBearer.split(" ")[1];

  if (!accessToken) {
    return res
      .status(401)
      .json({ message: "Access token không được cung cấp!" });
  }

  try {
    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    const { userId } = decodedToken;

    const user = router.db.get("users").find({ id: userId }).value();

    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại!" });
    }

    const { password: userPassword, ...userInfo } = user;

    res.json({ message: "Đăng nhập tự động thành công!", user: userInfo });
  } catch (err) {
    return res.status(401).json({ message: "Access token không hợp lệ!" });
  }
};

module.exports = autoLoginController;
