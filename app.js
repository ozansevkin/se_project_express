const express = require("express");
const mongoose = require("mongoose");

const app = express();
const { PORT = 3001 } = process.env;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}...`);
});

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error(`Error connecting to MongoDB: ${err}`);
});

app.use(express.json()); // for parsing application/json
app.use((req, res, next) => {
  req.user = {
    _id: "64658af8014c642ff5cfde05",
  };
  next();
}); // temporary authorization middleware
app.use(require("./routes"));
