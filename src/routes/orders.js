const express = require("express");
const router = express.Router();
const {
  ordersGetController,
  ordersCreateController,
} = require("../controllers/orders");

router.get("/", (req, res) => {
  ordersGetController(req, res);
});

router.post("/create", async (req, res) => {
  ordersCreateController(req, res);
});

module.exports = router;
