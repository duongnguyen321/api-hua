const express = require("express");
const router = express.Router();
const _ = require("lodash");
const jsonServer = require("json-server");
const db = jsonServer.router("data/db.json");
const {
  productsTypeController,
  productsIdController,
} = require("../controllers/products");

router.get("/type/:type", (req, res) => {
  productsTypeController(req, res, _, db);
});

router.get("/:id", (req, res) => {
  productsIdController(req, res, db);
});

module.exports = router;
