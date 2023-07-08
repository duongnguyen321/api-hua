const express = require("express");
const router = express.Router();
const {
  authLoginController,
  authRegisterController,
  autoLoginController,
  resetTokenMiddleware,
} = require("../controllers/auth");

router.post("/login", async (req, res) => {
  authLoginController(req, res);
});

router.post("/register", async (req, res) => {
  authRegisterController(req, res);
});

router.post("/auth-token", async (req, res) => {
  autoLoginController(req, res);
});
router.post("/reset-token", async (req, res) => {
  resetTokenMiddleware(req, res);
});

module.exports = router;
