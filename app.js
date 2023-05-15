const express = require("express");
const mongoose = require("mongoose");

const app = express();
const { PORT = 3001 } = process.env;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}...`);
});

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
