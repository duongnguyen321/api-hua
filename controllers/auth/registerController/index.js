const registerController = async (req, res, router, uuidv4, bcrypt) => {
  const { username, password, name, email, address, phone } = req.body;
  const existingUser = await router.db.get("users").find({ username }).value();
  if (existingUser) {
    res.status(409).json({
      message: "Tên đăng nhập đã tồn tại, vui lòng chọn tên đăng nhập khác!",
    });
    return;
  }
  const id = uuidv4();
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = {
    id,
    username,
    password: hashedPassword,
    name,
    email,
    address,
    phone,
    role: "user",
  };
  try {
    await router.db.get("users").push(user).write();
    const { password: userPassword, ...userInfo } = user;
    res.json({ message: "Đăng ký tài khoản thành công!", user: userInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Đã xảy ra lỗi khi đăng ký tài khoản!" });
  }
};
module.exports = registerController;