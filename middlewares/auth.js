const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../utils/errors");

const auth = (req, res, next) => {
  try {
    const authorization = req.get("authorization");

    if (!authorization) {
      throw new UnauthorizedError("Authorization token is missing.");
    }

    const token = authorization.replace("Bearer ", "");

    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = auth;
