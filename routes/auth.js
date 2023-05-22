const express = require("express");
const router = express.Router();
const {
  authLoginController,
  authRegisterController,
} = require("../controllers/auth");

router.post("/login", async (req, res) => {
  authLoginController(req, res);
});

router.post("/register", async (req, res) => {
  authRegisterController(req, res);
});

module.exports = router;
