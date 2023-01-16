const express = require("express");
const {
  addRecipe,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  getsavedRecipe,
  addlikedRecipe,
  addsavedRecipe,
  getlikedRecipe,
  deletelikedRecipe,
  deletesavedRecipe,
} = require("../controller/recipe");
const { protect } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const router = express.Router();

router
  .get("/:id?", getRecipe)
  .get("/?liked", protect, getlikedRecipe)
  .get("/?saved/", protect, getsavedRecipe)
  .post("/add", protect, upload, addRecipe)
  .post("/liked", protect, addlikedRecipe)
  .post("/saved", protect, addsavedRecipe)
  .put("/:id", upload, protect, updateRecipe)
  .delete("/:id", protect, deleteRecipe)
  .delete("/?liked/:id", deletelikedRecipe)
  .delete("/?saved/:id", deletesavedRecipe);

module.exports = router;
