const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const updateController = (req, res) => {
  const { id } = req.params;
  const { name, address, phone, email } = req.body;
  const user = router.db.get("users").find({ id }).value();
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
    router.db.get("users").find({ id }).assign(updatedUser).write();
    res.json({
      message: "Cập nhật thông tin thành công!",
      user: updatedUser,
    });
  }
};

module.exports = updateController;
