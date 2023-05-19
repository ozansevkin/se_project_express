const User = require("../models/user");
const ERROR_CODE = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_CODE[err.name]).send({ message: err.message });
      }

      return res.status(ERROR_CODE.ServerError).send({
        message: `An error has occurred on the server.`,
      });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError" || err.name === "CastError") {
        return res.status(ERROR_CODE[err.name]).send({ message: err.message });
      }

      return res.status(ERROR_CODE.ServerError).send({
        message: `An error has occurred on the server.`,
      });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE[err.name]).send({ message: err.message });
      }

      return res.status(ERROR_CODE.ServerError).send({
        message: `An error has occurred on the server.`,
      });
    });
};

module.exports = { getUsers, getUser, createUser };
