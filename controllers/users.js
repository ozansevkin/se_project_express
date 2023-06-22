const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const errorHandler = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() =>
      next(new NotFoundError("User with the provided ID is not found."))
    )
    .then((user) => res.send({ user }))
    .catch(next);
};

const updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { ...req.body },
    { new: true, runValidators: true }
  )
    .orFail(() =>
      next(new NotFoundError("User with the provided ID is not found."))
    )
    .then((user) => res.send({ user }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then((user) => {
        const userData = user.toObject();
        delete userData.password;
        return res.status(201).send({ user: userData });
      })
      .catch((err) => {
        if (err.code === 11000) {
          return next(
            new ConflictError("Entered an email address already exists.")
          );
        }

        return next(new BadRequestError("Invalid user data sent to server."));
      });
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new UnauthorizedError("Provide both email and password."));
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch(next);
};

module.exports = { getCurrentUser, updateProfile, createUser, login };
