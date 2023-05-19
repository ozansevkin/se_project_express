const router = require("express").Router();
const ERROR_CODE = require("../utils/errors");

router.use("/items", require("./clothingItems"));
router.use("/users", require("./users"));

router.use((req, res) => {
  res.status(ERROR_CODE.DocumentNotFoundError).send({
    message: "Requested resource not found",
  });
});

module.exports = router;
