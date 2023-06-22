const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const limiter = require("./utils/limiter");
const errorHandler = require("./middlewares/errorHandler");

// Destructure process.env variables
const { PORT = 3001 } = process.env;

// Create an Express application
const app = express();

// Set up MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db").catch((err) => {
  console.error(`Error on initial connection to MongoDB: ${err}`);
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error(
    `Error after initial connection was established to MongoDB: ${err}`
  );
});

// Use middlewares
app.use(cors()); // enable All CORS Requests from the client to the server
app.use(limiter); // middleware againist DoS attacks
app.use(helmet()); // middleware to set security headers
app.use(express.json()); // for parsing application/json

// Mount the routes
app.use(require("./routes"));

// Handle errors
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}...`);
});
