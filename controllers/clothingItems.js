const ClothingItem = require("../models/clothingItem");
const ERROR_CODE = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send({ data: items }))
    .catch((err) =>
      res.status(ERROR_CODE.ServerError).send({
        message: `An error has occurred on the server: ${err.message}`,
      })
    );
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const ownerId = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner: ownerId })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE[err.name]).send({ message: err.message });
      }

      return res.status(ERROR_CODE.ServerError).send({
        message: `An error has occurred on the server: ${err.message}`,
      });
    });
};

const deleteItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.itemId)
    .orFail()
    .then(() => res.send({}))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError" || err.name === "CastError") {
        return res.status(ERROR_CODE[err.name]).send({ message: err.message });
      }

      return res.status(ERROR_CODE.ServerError).send({
        message: `An error has occurred on the server: ${err.message}`,
      });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError" || err.name === "CastError") {
        return res.status(ERROR_CODE[err.name]).send({ message: err.message });
      }

      return res.status(ERROR_CODE.ServerError).send({
        message: `An error has occurred on the server: ${err.message}`,
      });
    });
};

const unlikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError" || err.name === "CastError") {
        return res.status(ERROR_CODE[err.name]).send({ message: err.message });
      }

      return res.status(ERROR_CODE.ServerError).send({
        message: `An error has occurred on the server: ${err.message}`,
      });
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
