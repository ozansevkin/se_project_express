const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const ERROR_CODE = require("../utils/errors");

const auth = (req, res, next) => {
  try {
    const authorization = req.get("authorization");

    if (!authorization) {
      throw new Error("Authorization token is missing.");
    }

    const token = authorization.replace("Bearer ", "");

    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;
    next();
  } catch (err) {
    res
      .status(ERROR_CODE.UnauthorizedError)
      .send({ message: `Unauthorized User: ${err.message}` });
  }
};

module.exports = auth;
