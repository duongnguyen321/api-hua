const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const jwt = require("jsonwebtoken");

const getController = (req, res) => {
  const accessTokenBearer = req.headers.authorization;

  const accessToken = accessTokenBearer.split(" ")[1];
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

    res.json({ message: "Tìm thấy người dùng!", user: userInfo });
  } catch (err) {
    return res.status(401).json({ message: "Không tìm thấy người dùng!" });
  }
};
module.exports = getController;
