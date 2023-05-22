const express = require("express");
const router = express.Router();
const {
  productsTypeController,
  productsIdController,
} = require("../controllers/products");

router.get("/type/:type", (req, res) => {
  productsTypeController(req, res);
});

router.get("/:id", (req, res) => {
  productsIdController(req, res);
});

module.exports = router;
