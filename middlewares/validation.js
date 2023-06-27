const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// Custom validation function
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateItem = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().required().min(2).max(30).messages({
        "string.empty": "The `name` field must be filled in",
        "string.min": "The minimum length of the `name` field is 2",
        "string.max": "The maximum length of the `name` field is 30",
      }),
      imageUrl: Joi.string().required().custom(validateURL).messages({
        "string.empty": "The `imageUrl` field must be filled in",
        "string.uri": "The `imageUrl` field must be a valid url",
      }),
    })
    .unknown(true),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().empty("").min(2).max(30).messages({
      "string.min": "The minimum length of the `name` field is 2",
      "string.max": "The maximum length of the `name` field is 30",
    }),
    avatar: Joi.string().empty("").custom(validateURL).messages({
      "string.uri": "The `avatar` field must be a valid url",
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "The `email` field must be filled in",
      "string.email": "The `email` field must be a valid email",
    }),
    password: Joi.string().required().messages({
      "string.empty": "The `password` field must be filled in",
    }),
  }),
});

const validateLogIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": "The `email` field must be filled in",
      "string.email": "The `email` field must be a valid email",
    }),
    password: Joi.string().required().messages({
      "string.empty": "The `password` field must be filled in",
    }),
  }),
});

const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).messages({
      "string.hex": "The `itemId` url parameter must be hexadecimal",
      "string.length":
        "The length of `itemId` url parameter must be 24 characters",
    }),
  }),
});

module.exports = {
  validateItem,
  validateUser,
  validateLogIn,
  validateItemId,
};
