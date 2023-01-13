const express = require("express");
const {
  getProfie,
  getRecipebyProfile,
} = require("../controller/profileController");
const { protect } = require("../middleware/auth");
const router = express.Router();

router
  .get("/", protect, getProfie)
  .get("/recipes", protect, getRecipebyProfile);

module.exports = router;
