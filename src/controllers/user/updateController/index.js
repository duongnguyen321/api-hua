const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const updateController = (req, res) => {
  const { userid } = req.query;
  const { name, address, phone, email } = req.body;
  try {
    const user = router.db.get("users").find({ id: userid }).value();
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    } else {
      const updatedUser = {
        ...user,
        name: name || user.name,
        address: address || user.address,
        phone: phone || user.phone,
        email: email || user.email,
      };
      router.db.get("users").find({ id: userid }).assign(updatedUser).write();
      res.status(200).json({
        message: "Cập nhật thông tin thành công!",
        user: updatedUser,
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi cập nhật thông tin người dùng!" });
  }
};

module.exports = updateController;
