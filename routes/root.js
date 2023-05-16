const express = require("express");
const fs = require("fs");
const markdownIt = require("markdown-it");
const app = express();
app.use(express.static("public"));

app.get("/api", (req, res) => {
  const viPath = "docs/docs.vi.md";
  const enPath = "docs/docs.en.md";

  fs.readFile(viPath, "utf8", (errVi, dataVi) => {
    if (errVi) {
      return res.status(500).send("Internal Server Error");
    }
    fs.readFile(enPath, "utf8", (errEn, dataEn) => {
      if (errEn) {
        return res.status(500).send("Internal Server Error");
      }

      const md = new markdownIt();
      const viContent = md.render(dataVi);
      const enContent = md.render(dataEn);

      const data = {
        vi: viContent,
        en: enContent,
      };

      return res.json(data);
    });
  });
});

module.exports = app;
