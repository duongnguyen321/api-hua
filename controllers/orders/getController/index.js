const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const getController = (req, res ) => {
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
};
module.exports = getController;
