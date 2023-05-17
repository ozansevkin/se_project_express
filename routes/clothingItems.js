const router = require("express").Router();

router.get("/items", getItems);
router.post("/items", createItem);
router.delete("/items/:itemId", deleteItem);

module.exports = router;
