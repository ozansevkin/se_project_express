const router = require("express").Router();
const { createUser, login } = require("../controllers/users");
const NotFoundError = require("../errors/NotFound");
const { validateUser, validateLogIn } = require("../middlewares/validation");

router.post("/signup", validateUser, createUser);
router.post("/signin", validateLogIn, login);

router.use("/items", require("./clothingItems"));
router.use("/users", require("./users"));

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found."));
});

module.exports = router;
