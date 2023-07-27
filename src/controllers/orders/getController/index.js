const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const jwt = require("jsonwebtoken");
const getController = async (req, res) => {
  const { userid, orderid } = req.query;
  const accessToken = req.headers.authorization.split(" ")[1];
  if (!accessToken) {
    return res.status(400).json({ message: "Access token không hợp lệ!" });
  }
  const decoded = await jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET
  );
  if (!decoded) {
    return res.status(400).json({ message: "Access token không hợp lệ!" });
  }
  if (userid && decoded.userid !== userid) {
    return res.status(400).json({ message: "Access token không hợp lệ!" });
  }
  if (orderid) {
    const order = await router.db
      .get("orders")
      .value()
      .find((order) => order.id === orderid);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    if (userid && order.userid !== userid) {
      return res.status(400).json({ message: "Access token không hợp lệ!" });
    }
  }

  try {
    const orders = router.db.get("orders").value();
    let products = [];
    if (router.db.has("products").value()) {
      products = router.db.get("products").value();
    }
    let result = {};
    if (userid) {
      const userOrders = orders.filter((order) => order.userid === userid);
      result = {
        ...result,
        orders: userOrders.map((order) => {
          const user = router.db
            .get("users")
            .find({ id: order.userid })
            .value();
          const orderProducts = order.productid.map((productid, index) => {
            const product = products.find(
              (product) => product.id === productid
            );
            const { ratings, ...rest } = product;
            return (
              {
                ...rest,
                quantity: order.quantity[index],
              } || null
            );
          });
          const totalPrices = orderProducts.reduce(
            (total, product) => total + product.price * product.quantity,
            0
          );
          const totalProducts = orderProducts.reduce(
            (total, product) => total + product.quantity,
            0
          );
          console.log('user', user);
          return {
            id: order.id,
            totalPrices,
            totalProducts,
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
    } else if (orderid) {
      const order = orders.find((order) => order.id === orderid);
      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }
      const orderProducts = order.productid.map((productid, index) => {
        const product = products.find((product) => product.id === productid);
        const { ratings, ...rest } = product;
        return (
          {
            ...rest,
            quantity: order.quantity[index],
          } || null
        );
      });
      const user = router.db.get("users").find({ id: order.userid }).value();

      const orderInfo = [
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
      ];
      const totalPrices = orderInfo[0].products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );
      const totalProducts = orderInfo[0].products.reduce(
        (total, product) => total + product.quantity,
        0
      );
      result = {
        ...result,
        ...orderInfo[0],
        totalPrices,
        totalProducts,
      };
    } else {
      return res.status(400).json({ message: "Thiếu thông tin!" });
    }
    return res.status(200).json({
      message: "Lấy thông tin đơn hàng thành công!",
      ...result,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Có lỗi khi lấy thông tin đơn hàng!" });
  }
};
module.exports = getController;
