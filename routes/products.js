const express = require("express");
const router = express.Router();
const {
  getById,
  getByType,
  addProductController,
  updateProductController,
  deleteProductController,
} = require("../controllers/products");

router.get("/type/:type", (req, res) => {
  getByType(req, res);
});

router.get("/:id", (req, res) => {
  getById(req, res);
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
