const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const { v4: uuidv4 } = require("uuid");
const createController = async (req, res) => {
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
    return res
      .status(500)
      .json({ message: "Sản phẩm không tồn tại hoặc không đủ số lượng!" });
  }
  res.json({ message: "Đặt hàng thành công!", orders });
};
module.exports = createController;
