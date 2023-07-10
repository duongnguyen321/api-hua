const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../helper");

const refreshTokenMiddleware = async (req, res, next) => {
  const refreshToken = req.headers.authorization.split(" ")[1];
  const userid = req.headers.userid;
  const prevAccessToken = req.body.accessToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Reset token không được cung cấp!" });
  }

  try {
    const decodedResetToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const decodedPrevAccessToken = jwt.decode(
      prevAccessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    const { userid: useridResetToken } = decodedResetToken;
    const { userid: useridPrevAccessToken } = decodedPrevAccessToken;
    if (userid !== useridResetToken || userid !== useridPrevAccessToken) {
      return res
        .status(401)
        .json({ message: "Reset token hoặc Access token không hợp lệ!" });
    }
    const user = router.db.get("users").find({ id: userid }).value();
    if (!user) {
      return res
        .status(401)
        .json({ message: "Reset token hoặc Access token không hợp lệ!" });
    }
    const accessToken = generateAccessToken(user.id);
    req.body.accessToken = accessToken;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Reset token hoặc Access token không hợp lệ!" });
  }
};

const autoLoginController = async (req, res) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  const userid = req.headers.userid;

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
    const { userid: useridToken } = decodedToken;

    if (userid !== useridToken) {
      return res.status(401).json({ message: "Access token không hợp lệ!" });
    }

    const user = router.db.get("users").find({ id: userid }).value();

    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại!" });
    }

    const { password: userPassword, ...userInfo } = user;

    res
      .status(200)
      .json({ message: "Đăng nhập tự động thành công!", user: userInfo });
  } catch (err) {
    return res.status(401).json({ message: "Access token không hợp lệ!" });
  }
};

module.exports = {
  autoLoginController,
  refreshTokenMiddleware,
};
