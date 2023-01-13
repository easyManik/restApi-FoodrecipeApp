const express = require("express");
const router = express.Router();

const users = require("./user");
const recipesRouter = require("./recipe");
const profile = require("./profile");

router.use("/profile", profile);

router.use("/recipes", recipesRouter);
router.use("/users", users);
module.exports = router;
