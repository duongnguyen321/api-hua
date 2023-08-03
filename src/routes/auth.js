const express = require("express");
const router = express.Router();
const {
  authLoginController,
  authRegisterController,
  autoLoginController,
  refreshTokenMiddleware,
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
router.post("/refresh-token", async (req, res) => {
  refreshTokenMiddleware(req, res);
});

module.exports = router;
