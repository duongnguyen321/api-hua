const express = require("express");
const router = express.Router();
const jsonServer = require("json-server");
const db = jsonServer.router("data/db.json");
const {
  usersGetController,
  userUpdateController,
} = require("../controllers/users");

router.get("/:id", (req, res) => {
  usersGetController(req, res, db);
});

router.patch("/:id", (req, res) => {
  userUpdateController(req, res, db);
});

module.exports = router;
