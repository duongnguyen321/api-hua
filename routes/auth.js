const express = require("express");
const router = express.Router();
const {
  authLoginController,
  authRegisterController,
  autoLoginController,
} = require("../controllers/auth");

router.post("/login", async (req, res) => {
  authLoginController(req, res);
});

router.post("/register", async (req, res) => {
  authRegisterController(req, res);
});

router.get("/auth-token", async (req, res) => {
  autoLoginController(req, res);
});

module.exports = router;
