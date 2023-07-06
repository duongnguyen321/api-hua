const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1w",
  });
  return accessToken;
};

const resetTokenMiddleware = async (req, res, next) => {
  const userId = req.body.userId;
  const resetToken = req.headers.authorization.split(" ")[1];

  if (!resetToken) {
    return res
      .status(401)
      .json({ message: "Reset token không được cung cấp!" });
  }

  try {
    const resetTokenSecret = process.env.RESET_TOKEN_SECRET;
    const decodedToken = jwt.verify(resetToken, resetTokenSecret);
    const { userId: userIdToken } = decodedToken;

    if (userId !== userIdToken) {
      return res.status(401).json({ message: "Reset token không hợp lệ!" });
    }

    const user = router.db.get("users").find({ id: userId }).value();

    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại!" });
    }

    const accessToken = generateAccessToken(user.id);

    return res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: "Reset token không hợp lệ!" });
  }
};

const autoLoginController = async (req, res) => {
  const userId = req.body.userId;
  const accessToken = req.headers.authorization.split(" ")[1];

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
    const { userId: userIdToken } = decodedToken;

    if (userId !== userIdToken) {
      return res.status(401).json({ message: "Access token không hợp lệ!" });
    }

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

module.exports = {
  autoLoginController,
  resetTokenMiddleware,
};
