const express = require("express");
const router = express.Router();
const jsonServer = require("json-server");
const db = jsonServer.router("data/db.json");
const {
  authLoginController,
  authRegisterController,
} = require("../controllers/auth");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

router.post("/login", async (req, res) => {
  authLoginController(req, res, db, bcrypt);
});

router.post("/register", async (req, res) => {
  authRegisterController(req, res, db, uuidv4, bcrypt);
});

module.exports = router;
