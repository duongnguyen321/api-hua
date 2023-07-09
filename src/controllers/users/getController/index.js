const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const jwt = require("jsonwebtoken");
const getController = (req, res) => {
  const { id } = req.params;
  const accessTokenBearer = req.headers.authorization;
  if (!accessTokenBearer) {
    return res
      .status(401)
      .json({ message: "Access token không được cung cấp!" });
  }
  const accessToken = accessTokenBearer.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({ message: "Access token không hợp lệ !" });
  }
  try {
    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    const { userid } = decodedToken;
    if (userid !== id) {
      return res.status(401).json({ message: "Access token không hợp lệ!" });
    }
    const user = router.db.get("users").find({ id: userid }).value();
    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại!" });
    }
    const { password: userPassword, ...userInfo } = user;
    res.status(200).json({ message: "Tìm thấy người dùng!", user: userInfo });
  } catch (err) {
    return res.status(401).json({ message: "Access token không hợp lệ!" });
  }
};
module.exports = getController;
