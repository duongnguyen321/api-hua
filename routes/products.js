const express = require("express");
const router = express.Router();
const {
  getProductsController,
  addProductController,
  updateProductController,
  deleteProductController,
} = require("../controllers/products");

router.get("/", (req, res) => {
  getProductsController(req, res);
});

router.post("/", (req, res) => {
  addProductController(req, res);
});

router.put("/", (req, res) => {
  updateProductController(req, res);
});

router.delete("/", (req, res) => {
  deleteProductController(req, res);
});

module.exports = router;
