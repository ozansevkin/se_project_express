const router = require("express").Router();
const { createUser, login } = require("../controllers/users");
const NotFoundError = require("../errors/NotFound");
const { validateUser, validateLogIn } = require("../middlewares/validation");

router.post("/signup", validateUser, createUser);
router.post("/signin", validateLogIn, login);

router.use("/items", require("./clothingItems"));
router.use("/users", require("./users"));

router.use((err, req, res, next) => {
  if (err) {
    next(err);
  } else {
    next(new NotFoundError("Requested resource not found."));
  }
});

module.exports = router;
