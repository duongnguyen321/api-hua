const express = require("express");
const router = express.Router();

const {
  usersGetController,
  userUpdateController,
} = require("../controllers/user");

router.get("/", (req, res) => {
  usersGetController(req, res);
});

router.patch("/", (req, res) => {
  userUpdateController(req, res);
});

module.exports = router;
