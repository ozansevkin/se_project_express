const router = require("express").Router();
const { getUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use(auth);
router.get("/:userId", getUser);

module.exports = router;
