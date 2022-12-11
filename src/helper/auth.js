const jwt = require("jsonwebtoken");
const key = process.env.JWT_KEY;

const generateToken = (payload) => {
  const verifyOtp = {
    expiresIn: "1h",
  };
  const token = jwt.sign(payload, key, verifyOtp);
  return token;
};
module.exports = { generateToken };
