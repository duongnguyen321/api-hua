const jsonServer = require("json-server");
const router = jsonServer.router("data/db.json");
const { v4: uuidv4 } = require("uuid");

const createController = async (req, res) => {
  const { items } = req.body;
  const userid = req.headers.userid;
  if (!userid) {
    return res.status(400).json({ message: "Thiếu thông tin đơn hàng" });
  }
  try {
    const orders = [];
    const products = await router.db.get("products").value();
    const order = {
      id: uuidv4(),
      userid,
      productid: [],
      quantity: [],
      total_price: 0,
      status: "Đang xử lý",
    };
    for (const { productid, quantity } of items) {
      const product = products.find((p) => p.id === productid);
      if (!product) {
        throw new Error(`Sản phẩm ${productid} không tồn tại!`);
      }
      if (product.quantity < quantity) {
        throw new Error(`Sản phẩm ${productid} không đủ số lượng!`);
      }
      order.productid.push(productid);
      order.quantity.push(quantity);
      order.total_price += product.price * quantity;
      await router.db
        .get("products")
        .find({ id: productid })
        .assign({ quantity: product.quantity - quantity })
        .write();
    }
    await router.db.get("orders").push(order).write();
    orders.push(order);
    return res.status(200).json({ message: "Đặt hàng thành công!", orders });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Sản phẩm không tồn tại hoặc không đủ số lượng!" });
  }
};
module.exports = createController;

