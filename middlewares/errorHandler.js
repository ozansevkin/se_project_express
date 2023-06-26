const errorHandler = (err, req, res, next) => {
  // Log the error
  // console.error(err);

  const { statusCode = 500 } = err;
  let { message } = err;

  if (statusCode === 500) {
    message = "An error occurred on the server";
  }

  res.status(statusCode).send({ message });
};

module.exports = errorHandler;
