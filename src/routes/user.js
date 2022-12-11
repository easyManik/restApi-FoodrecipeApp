const express = require("express");
const { UserController } = require("../controller/user");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", protect, UserController.login);
router.post("/verif", UserController.otp);

module.exports = router;
