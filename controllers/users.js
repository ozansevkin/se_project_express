const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../errors/BadRequest");
const UnauthorizedError = require("../errors/Unauthorized");
const NotFoundError = require("../errors/NotFound");
const ConflictError = require("../errors/Conflict");

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError("User with the provided ID is not found."))
    .then((user) => res.send({ user }))
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(new NotFoundError("User with the provided ID is not found."))
    .then((user) => res.send({ user }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return next(
          new ConflictError("Entered an email address already exists.")
        );
      }

      return bcrypt.hash(password, 10).then((hash) => {
        User.create({ name, avatar, email, password: hash }).then((user) => {
          if (!user) {
            return next(
              new BadRequestError("Invalid user data sent to server.")
            );
          }

          const userData = user.toObject();
          delete userData.password;
          return res.status(201).send({ user: userData });
        });
      });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new UnauthorizedError("Provide both email and password."));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch(next);
};

module.exports = { getCurrentUser, updateProfile, createUser, login };
