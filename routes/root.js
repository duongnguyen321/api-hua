const express = require("express");
const app = express();
app.use(express.static("public"));
const rootController = require("../controllers/root");

app.get("/api", (req, res) => {
  rootController(req, res);
});

module.exports = app;
