const express = require("express");
const path = require("path");

const app = express();

app.get("/", function (req, res) {
  res.sendfile(path.join(__dirname, "/index.html"));
});

app.listen(3000);
console.log("port at 3000");
