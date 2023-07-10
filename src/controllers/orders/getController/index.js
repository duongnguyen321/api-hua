const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const jwt = require("jsonwebtoken");
const getController = async (req, res) => {
  const { userid = "", orderid = "" } = req.query;
  const accessToken = req.headers.authorization.split(" ")[1];

  if (!accessToken) {
    return res
      .status(401)
      .json({ message: "Access token không được cung cấp!" });
  }

  if (!userid && !orderid) {
    return res.status(400).json({ message: "Thiếu thông tin đơn hàng" });
  }
  const decodedAccessToken = await jwt.decode(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET
  );
  const { userid: useridAccessToken } = decodedAccessToken;

  try {
    const orders = router.db.get("orders").value();
    let products = [];
    if (router.db.has("products").value()) {
      products = router.db.get("products").value();
    }
    let result = {};
    if (userid) {
      if (useridAccessToken !== userid) {
        return res.status(401).json({ message: "Access token không hợp lệ!" });
      }
      const userOrders = orders.filter((order) => order.userid === userid);
      result = {
        ...result,
        orders: await userOrders.map((order) => {
          const user = router.db
            .get("users")
            .find({ id: order.userid })
            .value();
          const orderProducts = order.productid.map((productid, index) => {
            const product = products.find(
              (product) => product.id === productid
            );
            const { ratings, sales, ...newProduct } = product;
            return (
              {
                ...newProduct,
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
    } else if (orderid) {
      const order = orders.find((order) => order.id === orderid);
      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }
      const orderProducts = order.productid.map((productid, index) => {
        const product = products.find((product) => product.id === productid);
        const { ratings, sales, ...newProduct } = product;
        return (
          {
            ...newProduct,
            quantity: order.quantity[index],
          } || null
        );
      });
      const user = router.db.get("users").find({ id: order.userid }).value();
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
      return res.status(400).json({ message: "Thiếu thông tin đơn hàng" });
    }
    const totalPrices = await result.orders.map((order) => {
      return order.products.reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0);
    });
    const totalProducts = await result.orders.map((order) => {
      return order.products.reduce((total, product) => {
        return total + product.quantity;
      }, 0);
    });
    if (result.orders.length === 1) {
      result.orders[0].totalPrice = totalPrices[0];
      result.orders[0].totalProduct = totalProducts[0];
      result.orders = result.orders[0];
    } else {
      result.orders = result.orders.map((order, index) => {
        order.totalPrice = totalPrices[index];
        order.totalProduct = totalProducts[index];
        return order;
      });
    }
    return res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi lấy dữ liệu đơn hàng !" });
  }
};
module.exports = getController;

