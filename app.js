require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { errors } = require("celebrate");
const limiter = require("./utils/limiter");
const errorHandler = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

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
app.use(requestLogger); // enable request logger
app.use(limiter); // middleware againist DoS attacks
app.use(express.json()); // for parsing application/json
app.use(helmet()); // middleware to set security headers

// Mount the routes
app.use(require("./routes"));

// Enable error logger
app.use(errorLogger);

// Handle validation errors with celebrate error handler
app.use(errors());

// Handle rest of the errors with centralised errorHandler middleware
// Validation errors thrown by Mongoose handled here
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}...`);
});
