const express = require("express");
const router = express.Router();

const {
  usersGetController,
  userUpdateController,
} = require("../controllers/user");

router.get("/:userid", (req, res) => {
  usersGetController(req, res);
});

router.patch("/:userid", (req, res) => {
  userUpdateController(req, res);
});

module.exports = router;
