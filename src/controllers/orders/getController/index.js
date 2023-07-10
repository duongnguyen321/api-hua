const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");

const getController = (req, res) => {
  const userid = req.query.userid;
  const orderid = req.query.orderid;
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
        const user = router.db.get("users").find({ id: order.userid }).value();
        const orderProducts = order.productid.map((productid, index) => {
          const product = products.find((product) => product.id === productid);
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
  } else if (orderid) {
    const order = orders.find((order) => order.id === orderid);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    const orderProducts = order.productid.map((productid, index) => {
      const product = products.find((product) => product.id === productid);
      return (
        {
          ...product,
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
    const allOrders = orders.map((order) => {
      const user = router.db.get("users").find({ id: order.userid }).value();
      const orderProducts = order.productid.map((productid, index) => {
        const product = products.find((product) => product.id === productid);
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
  res.status(200).json(result);
};
module.exports = getController;
