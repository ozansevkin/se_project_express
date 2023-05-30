const User = require("../models/user");
const ERROR_CODE = require("../utils/errors");
const bcrypt = require("bcrypt");

const getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_CODE[err.name]).send({ message: err.message });
      }

      return res.status(ERROR_CODE.ServerError).send({
        message: `An error has occurred on the server: ${err.message}`,
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
        message: `An error has occurred on the server: ${err.message}`,
      });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        console.error(err);
        if (err.name === "ValidationError") {
          return res
            .status(ERROR_CODE[err.name])
            .send({ message: err.message });
        }

        if (err.code === 11000) {
          return res.status(ERROR_CODE.ValidationError).send({
            message: `Email address you entered is already in use. Try a different one. ${err.message}`,
          });
        }

        return res.status(ERROR_CODE.ServerError).send({
          message: `An error has occurred on the server: ${err.message}`,
        });
      });
  });
};

module.exports = { getUsers, getUser, createUser };
