const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
router.post("/create", async (req, res) => {
  adminController(req, res);
});

module.exports = router;
