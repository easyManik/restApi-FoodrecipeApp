const express = require("express");
const { UserController } = require("../controller/user");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
// const { auth } = require("../middleware/auth");

const router = express.Router();

router
  .post("/register", UserController.register)
  .post("/login", UserController.login)
  .post("/verif", UserController.otp)
  .get("/profile", protect, UserController.getProfile)
  // .put("/edit", protect, upload, UserController.updateUsers)
  .get("/logout", protect, UserController.userLogout);

module.exports = router;
