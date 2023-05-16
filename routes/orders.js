const express = require("express");
const router = express.Router();
const jsonServer = require("json-server");
const db = jsonServer.router("data/db.json");
const {
  ordersGetController,
  ordersCreateController,
} = require("../controllers/orders");
const { v4: uuidv4 } = require("uuid");

router.get("/", (req, res) => {
  ordersGetController(req, res, db);
});

router.post("/create", async (req, res) => {
  ordersCreateController(req, res, db, uuidv4);
});

module.exports = router;
