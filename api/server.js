const jsonServer = require("json-server");
const _ = require("lodash");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3001;
server.use(middlewares);
server.use(jsonServer.bodyParser);
server.get("/products/type/:type", (req, res) => {
  const { type } = req.params;
  const { minPrice, maxPrice } = req.query;
  const data = _(router.db.get("products"))
    .filter((product) => type === "all" || product.type === type)
    .filter((product) => !minPrice || product.price >= minPrice)
    .filter((product) => !maxPrice || product.price <= maxPrice)
    .value();
  res.json(data);
});
server.get("/products/:id", (req, res) => {
  const { id } = req.params;
  const product = router.db.get("products").find({ id }).value();
  if (!product) {
    res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
  } else {
    res.json(product);
  }
});
server.get("/orders", (req, res) => {
  const user_id = req.query.user_id;
  const order_id = req.query.order_id;
  const orders = router.db.get("orders").value();
  let products = [];
  if (router.db.has("products").value()) {
    products = router.db.get("products").value();
  }
  let result = {};
  if (user_id) {
    const userOrders = orders.filter((order) => order.user_id === user_id);
    result = {
      ...result,
      orders: userOrders.map((order) => {
        const user = router.db.get("users").find({ id: order.user_id }).value();
        const orderProducts = order.product_id.map((product_id, index) => {
          const product = products.find((product) => product.id === product_id);
          return (
            {
              ...product,
              quantity: order.quantity[index],
            } || null
          );
        });
        return {
          id: order.id,
          status: order.status,
          products: orderProducts,
          user: {
            name: user.name,
            email: user.email,
            address: user.address,
            phone: user.phone,
          },
        };
      }),
    };
  } else if (order_id) {
    const order = orders.find((order) => order.id === order_id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    const orderProducts = order.product_id.map((product_id, index) => {
      const product = products.find((product) => product.id === product_id);
      return (
        {
          ...product,
          quantity: order.quantity[index],
        } || null
      );
    });
    const user = router.db.get("users").find({ id: order.user_id }).value();
    result = {
      ...result,
      orders: [
        {
          id: order.id,
          status: order.status,
          products: orderProducts,
          user: {
            name: user.name,
            email: user.email,
            address: user.address,
            phone: user.phone,
          },
        },
      ],
    };
  } else {
    const allOrders = orders.map((order) => {
      const user = router.db.get("users").find({ id: order.user_id }).value();
      const orderProducts = order.product_id.map((product_id, index) => {
        const product = products.find((product) => product.id === product_id);
        return (
          {
            ...product,
            quantity: order.quantity[index],
          } || null
        );
      });
      return {
        id: order.id,
        name: user.name,
        status: order.status,
        products: orderProducts,
      };
    });
    result = { ...result, orders: allOrders };
  }
  res.json(result);
});
server.post("/orders/create", async (req, res) => {
  const { items } = req.body;
  const user_id = req.headers.user;
  const orders = [];
  try {
    const products = await router.db.get("products").value();
    const order = {
      id: uuidv4(),
      user_id,
      product_id: [],
      quantity: [],
      total_price: 0,
      status: "Đang xử lý",
    };
    for (const { product_id, quantity } of items) {
      const product = products.find((p) => p.id === product_id);
      if (!product) {
        throw new Error(`Sản phẩm ${product_id} không tồn tại!`);
      }
      if (product.quantity < quantity) {
        throw new Error(`Sản phẩm ${product_id} không đủ số lượng!`);
      }
      order.product_id.push(product_id);
      order.quantity.push(quantity);
      order.total_price += product.price * quantity;
      await router.db
        .get("products")
        .find({ id: product_id })
        .assign({ quantity: product.quantity - quantity })
        .write();
    }
    await router.db.get("orders").push(order).write();
    orders.push(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server!" });
  }
  res.json({ message: "Đặt hàng thành công!", orders });
});
server.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = router.db.get("users").find({ id }).omit(["password"]).value();
  if (!user) {
    res.status(404).json({ message: "Không tìm thấy người dùng!" });
  } else {
    res.json(user);
  }
});
server.patch("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, address, phone, email } = req.body;
  const user = router.db.get("users").find({ id }).value();
  if (!user) {
    res.status(404).json({ message: "Không tìm thấy người dùng!" });
  } else {
    const updatedUser = {
      ...user,
      name: name || user.name,
      address: address || user.address,
      phone: phone || user.phone,
      email: email || user.email,
    };
    router.db.get("users").find({ id }).assign(updatedUser).write();
    res.json({ message: "Cập nhật thông tin thành công!", user: updatedUser });
  }
});
server.post("/admins/create", async (req, res) => {
  const { username, password, role, address, phone, name, email } = req.body;
  const currentUser = req.headers.user;
  const passswordCurrentUser = req.headers.password;
  if (!currentUser || !passswordCurrentUser) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
  }
  const currentUserInfo = router.db
    .get("users")
    .find({ username: currentUser })
    .value();
  if (!currentUserInfo || currentUserInfo.role !== "admin") {
    return res
      .status(401)
      .json({ message: "Bạn không có quyền truy cập vào API này!" });
  }
  const passswordCurrentUserMatch = await bcrypt.compare(
    passswordCurrentUser,
    currentUserInfo.password
  );
  if (!passswordCurrentUserMatch) {
    return res.status(401).json({ message: "Mật khẩu của Admin không đúng!" });
  }
  const existingAdmin = router.db
    .get("users")
    .find({ username, role: "admin" })
    .value();
  if (existingAdmin) {
    return res.status(409).json({ message: "Admin đã tồn tại!" });
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newAdmin = {
    id: uuidv4(),
    username,
    password: hashedPassword,
    address,
    email,
    phone,
    name,
    role,
  };
  try {
    await router.db.get("users").push(newAdmin).write();
    const { password: userPassword, ...userInfo } = newAdmin;
    res.json({ message: "Tạo admin mới thành công!", admin: userInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Đã xảy ra lỗi khi tạo admin mới!" });
  }
});
server.post("/login", async (req, res) => {
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
  res.json({ message: "Đăng nhập thành công!", user: userInfo });
});
server.post("/register", async (req, res) => {
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
});
server.use(router);
server.listen(port, () => {
  console.log("App listening on port: " + port);
});
