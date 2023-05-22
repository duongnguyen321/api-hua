const express = require("express");
const router = express.Router();

const {
  usersGetController,
  userUpdateController,
} = require("../controllers/users");

router.get("/:id", (req, res) => {
  usersGetController(req, res);
});

router.patch("/:id", (req, res) => {
  userUpdateController(req, res);
});

module.exports = router;
