const express = require("express");
const router = express.Router();
const jsonServer = require("json-server");
const db = jsonServer.router("data/db.json");
const adminController = require("../controllers/admin");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

router.post("/create", async (req, res) => {
  adminController(req, res, db, bcrypt, uuidv4);
});

module.exports = router;
