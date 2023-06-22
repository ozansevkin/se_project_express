const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { UnauthorizedError } = require("../utils/errors");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
    default: "Elise Bouer",
  },
  avatar: {
    type: String,
    required: true,
    default:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Elise.png",
    validate: {
      validator: (value) => validator.isURL(value),
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "You must enter a valid Email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // This way, the user's password hash won't be returned from the database by default
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password") // to get the password hash in the user object
    .then((user) => {
      const error = new UnauthorizedError("Incorrect email or password");

      // not found - reject promise
      if (!user) {
        return Promise.reject(error);
      }

      // found - compare hashes
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(error);
        }

        return user;
      });
    });
};

module.exports = mongoose.model("User", userSchema);
