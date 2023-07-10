const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const jwt = require("jsonwebtoken");
const getController = async (req, res) => {
  const { userid } = req.query;
  const accessToken = req.headers.authorization.split(" ")[1];
  if (!accessToken) {
    return res
      .status(401)
      .json({ message: "Access token không được cung cấp!" });
  }
  try {
    const decodedToken = await jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    const { userid: userIdDecoded } = decodedToken;
    if (userIdDecoded !== userid) {
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
