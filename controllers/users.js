const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ERROR_CODE = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
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

const updateProfile = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { ...req.body },
    { new: true, runValidators: true }
  )
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
      .then((user) => {
        const userData = user.toObject();
        delete userData.password;
        return res.status(201).send({ data: userData });
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          return res
            .status(ERROR_CODE[err.name])
            .send({ message: err.message });
        }

        if (err.code === 11000) {
          return res.status(ERROR_CODE.ConflictError).send({
            message: `Email address you entered is already in use. Try a different one. ${err.message}`,
          });
        }

        return res.status(ERROR_CODE.ServerError).send({
          message: `An error has occurred on the server: ${err.message}`,
        });
      });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(ERROR_CODE.UnauthorizedError)
      .send({ message: "Provide both email and password" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.send({ data: { token } });
    })
    .catch((err) => {
      if (err.name === "UnauthorizedError") {
        return res.status(ERROR_CODE[err.name]).send({ message: err.message });
      }

      return res.status(ERROR_CODE.ServerError).send({
        message: `An error has occurred on the server: ${err.message}`,
      });
    });
};

module.exports = { getCurrentUser, updateProfile, createUser, login };
