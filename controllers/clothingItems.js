const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../errors/BadRequest");
const ForbiddenError = require("../errors/Forbidden");
const NotFoundError = require("../errors/NotFound");

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .populate("owner")
    .populate("likes")
    .then((items) => res.send({ items }))
    .catch(next);
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const ownerId = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner: ownerId })
    .then((item) => item.populate("owner"))
    .then((item) => res.status(201).send({ item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid item data sent to server."));
      } else {
        next(err);
      }
    });
};

const deleteItem = (req, res, next) => {
  ClothingItem.findById(req.params.itemId)
    .orFail(new NotFoundError("Item with the provided ID is not found."))
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return next(
          new ForbiddenError("User is not permitted to delete this item.")
        );
      }

      return item
        .deleteOne()
        .then(() => res.send({ message: "Item deleted." }));
    })
    .catch(next);
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new NotFoundError("Item with the provided ID is not found."))
    .populate("owner")
    .populate("likes")
    .then((item) => res.send({ item }))
    .catch(next);
};

const unlikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new NotFoundError("Item with the provided ID is not found."))
    .populate("owner")
    .populate("likes")
    .then((item) => res.send({ item }))
    .catch(next);
};

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
