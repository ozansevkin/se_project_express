const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const errorHandler = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send({ user }))
    .catch((err) => errorHandler(err, res));
};

const updateProfile = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { ...req.body },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send({ user }))
    .catch((err) => errorHandler(err, res));
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then((user) => {
        const userData = user.toObject();
        delete userData.password;
        return res.status(201).send({ user: userData });
      })
      .catch((err) => errorHandler(err, res));
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Provide both email and password.");
    error.name = "UnauthorizedError";

    return errorHandler(error, res);
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => errorHandler(err, res));
};

module.exports = { getCurrentUser, updateProfile, createUser, login };
