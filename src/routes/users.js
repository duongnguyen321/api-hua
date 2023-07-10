const express = require("express");
const router = express.Router();

const {
  userGetController,
  userUpdateController,
} = require("../controllers/user");

router.get("/:userid", (req, res) => {
  userGetController(req, res);
});

router.patch("/:userid", (req, res) => {
  userUpdateController(req, res);
});

module.exports = router;
