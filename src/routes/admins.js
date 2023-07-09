const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
router.post("/create", async (req, res) => {
  adminController.createController(req, res);
});
router.post("/hard-reset", async (req, res) => {
  adminController.hardResetController(req, res);
});

module.exports = router;
