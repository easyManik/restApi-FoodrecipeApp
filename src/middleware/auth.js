const jwt = require("jsonwebtoken");
const { verifyJWT } = require("../helper/jwt");
const { responses } = require("./common");

const key = process.env.JWT_KEY;
const protect = (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization) {
      const auth = req.headers.authorization;
      token = auth.split(" ")[1];
      console.log("token dari midleware auth", token);
      const payload = jwt.verify(token, key);
      req.payload = payload;
      next();
    } else {
      return responses(res, 404, false, null, "server need token");
    }
  } catch (err) {
    console.log(err);
    if (err && err.name == "JsonWebTokenError") {
      return responses(res, 404, false, null, "invalid token");
    }
    if (err && err.name == "TokenExpriredError") {
      return responses(res, 404, false, null, "expired token");
    }
    return responses(res, 404, false, null, "token not active");
  }
};

module.exports = { protect };
