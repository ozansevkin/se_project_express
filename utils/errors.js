const errors = {
  ValidationError: {
    statusCode: 400,
    message: "Invalid data sent to server.",
  },
  CastError: { statusCode: 400, message: "Invalid ID passed to paramaters." },
  UnauthorizedError: {
    statusCode: 401,
    message: "User has provided invalid credentials.",
  },
  ForbiddenError: {
    statusCode: 403,
    message: "User is not authorized to perform this action.",
  },
  DocumentNotFoundError: {
    statusCode: 404,
    message:
      "There is no such user or clothing item or the request was sent to a non-existent address.",
  },
  ConflictError: {
    statusCode: 409,
    message: "User has entered an email address already exists.",
  },
  ServerError: {
    statusCode: 500,
    message: "An error has occurred on the server.",
  },
};

const errorHandler = (err, res) => {
  // Log the error
  // console.error(err);

  const { ServerError, ConflictError, ...restErrors } = errors;
  let { statusCode, message } = ServerError;

  if (err.code === 11000) {
    ({ statusCode, message } = ConflictError);
  } else if (restErrors[err.name]) {
    ({ statusCode, message } = restErrors[err.name]);
  }

  res.status(statusCode).send({ message });
};

module.exports = errorHandler;
