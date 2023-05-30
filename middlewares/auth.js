const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const ERROR_CODE = require("../utils/errors");

const auth = (req, res, next) => {
  const authorization = req.get("authorization");

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;
    next();
  } catch (err) {
    res
      .status(ERROR_CODE.UnauthorizedError)
      .send({ message: `Unauthorized User: ${err.message}` });
    return;
  }
};

module.exports = auth;
