const router = require("express").Router();
const errorHandler = require("../utils/errors");
const { createUser, login } = require("../controllers/users");

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/items", require("./clothingItems"));
router.use("/users", require("./users"));

router.use((req, res) => {
  const error = new Error("Requested resource not found.");
  error.name = "DocumentNotFoundError";

  errorHandler(error, res);
});

module.exports = router;
