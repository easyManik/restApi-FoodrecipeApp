const cloudinary = require("cloudinary").v2;
const { cloudinaryConfig } = require("../config/cloudinary");
var fs = require("fs");
const { v4: uuid } = require("uuid");
const {
  addRecipe,
  getRecipe,
  getRecipeDetail,
  countData,
  updateRecipe,
  deleteRecipe,
  addLikedRecipes,
  addSavedRecipes,
  getLikedRecipes,
  getSavedRecipes,
  deleteSavedRecipes,
  deleteLikedRecipes,
} = require("../model/recipe");
const response = require("../helper/response");
const createError = require("http-errors");
const { destroyer } = require("../middleware/destroy");

module.exports.addRecipe = async (req, res, next) => {
  try {
    const { image, video } = req.files;
    const { title, ingredient } = req.body;
    console.log(req.payload);
    const { id_user } = req.payload;
    const recipe = {};
    recipe.id = uuid();
    recipe.title = title ? title : null;
    recipe.image = image ? image[0].path : null;
    recipe.ingredient = ingredient
      ? JSON.stringify(ingredient?.split(","))
      : null;
    recipe.video = video ? video[0].path : null;
    recipe.id_user = id_user;
    console.log(recipe);
    const { rowCount } = await addRecipe(recipe);
    if (!rowCount) {
      return response(res, [], 500, "INSERT TO DATABASE FAILED");
    }
    response(res, recipe, 200, "INSERT SUCCESS");
  } catch (error) {
    next(createError.InternalServerError());
  }
};
module.exports.updateRecipe = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { image, video } = req.files;
    const { title, ingredient } = req.body;
    console.log(req.payload);
    const { id_user } = req.payload;
    const recipe = {};
    recipe.id = id;
    recipe.title = title ? title : null;
    recipe.image = image ? image[0].path : null;
    recipe.ingredient = ingredient
      ? JSON.stringify(ingredient?.split(","))
      : null;
    recipe.video = video ? video[0].path : null;
    recipe.id_user = id_user;
    console.log(recipe);
    const { rowCount } = await updateRecipe(recipe);
    if (!rowCount) {
      return response(res, [], 500, "UPDATE TO DATABASE FAILED");
    }
    response(res, recipe, 200, "UPDATE SUCCESS");
  } catch (error) {
    console.log(error);
    next(createError.InternalServerError());
  }
};
module.exports.getRecipe = async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    try {
      const search = req.query.search || undefined;
      const orderby = req.query.sortby || "id";
      const order = req.query.sort || "ASC";
      const limit = +req.query.limit || 4;
      const page = +req.query.page || 1;
      const offset = (page - 1) * limit;
      const {
        rows: [{ total }],
      } = await countData(search);
      const { rows } = await getRecipe({
        search,
        orderby,
        order,
        limit,
        offset,
      });
      const pagination = {
        totalData: +total,
        totalPage: Math.ceil(total / limit),
        page: page,
        limit: limit,
      };
      return response(res, rows, 200, "GET DATA SUCCESS", pagination, search);
    } catch (error) {
      console.log(error);
      console.log("Error Getting data From Database");
      return response(res, null, 500, "GET DATA FAILED");
    }
  }
  try {
    const { rows, rowCount } = await getRecipeDetail(id);
    if (!rowCount) {
      return response(res, rows, 200, "NO DATA WITH THAT ID");
    }
    const ingredient = JSON.parse(rows[0].ingredient);
    rows[0].ingredient = ingredient;
    const data = rows;
    response(res, data, 200, "GET DETAIL DATA SUCCESS");
  } catch (error) {
    console.log(error);
    return next(createError(400, "GET DATA FAILED"));
  }
};

module.exports.addlikedRecipe = async (req, res, next) => {
  try {
    const id = req.payload.id_user;
    // get item for deleting
    const rows = await addLikedRecipes(req.body, id);
    if (!rows) {
      return response(res, [], 500, "FAILED add like DATA");
    }
    response(res, [], 200, "SUCCESS Like DATA");
  } catch (error) {
    console.log(error);
    next(createError.InternalServerError());
  }
};

module.exports.addsavedRecipe = async (req, res, next) => {
  try {
    const { id_user } = req.payload;
    const data = { id_user, id_recipe: req.body.id_recipe };
    // get item for deleting
    const rows = await addSavedRecipes(data);
    if (!rows) {
      return response(res, [], 500, "FAILED Saved recipe DATA");
    }
    response(res, [], 200, "SUCCESS SAVED RECIPE DATA");
  } catch (error) {
    console.log(error);
    next(createError.InternalServerError());
  }
};

module.exports.getlikedRecipe = async (req, res, next) => {
  try {
    const { id_user } = req.payload;

    console.log("id user from get liked", id_user);
    const {
      rows: [data],
    } = await getProfile(id_user);
    const rows = await getLikedRecipes(data.id_user);
    if (!rows) {
      return response(res, [], 500, "FAILED LIKE RECIPE DATA");
    }
    response(res, [], 200, "SUCCESS LIKED RECIPE DATA");
  } catch (error) {
    console.log(error);
    next(createError.InternalServerError());
  }
};

module.exports.getsavedRecipe = async (req, res, next) => {
  try {
    const { id_user } = req.payload;
    // get item for deleting
    const {
      rows: [data],
    } = await getProfile(id_user);
    const { rows } = await getSavedRecipes(data.id_user);
    if (!rows) {
      return response(res, [], 500, "FAILED GET SAVED RECIPE DATA");
    }
    response(res, [], 200, "SUCCESS SAVED RECIPE DATA");
  } catch (error) {
    console.log(error);
    next(createError.InternalServerError());
  }
};
module.exports.deleteRecipe = async (req, res, next) => {
  try {
    const id = req.params.id;
    // get item for deleting
    const { rows } = await getRecipeDetail(id);
    const { rowCount } = await deleteRecipe(id);
    if (!rowCount) {
      return response(res, [], 500, "FAILED DELETE DATA");
    }
    response(res, [], 200, "SUCCESS DELETE DATA");
  } catch (error) {
    console.log(error);
    next(createError.InternalServerError());
  }
};
module.exports.deletesavedRecipe = async (req, res, next) => {
  try {
    const rowCount = await deleteSavedRecipes(req.params.id);
    if (!rowCount) {
      return response(res, [], 500, "FAILED DELETE SAVED RECIPE DATA");
    }
    response(res, [], 200, "SUCCESS DELETE SAVED RECIPE DATA");
  } catch (error) {
    console.log(error);
    next(createError.InternalServerError());
  }
};

module.exports.deletelikedRecipe = async (req, res, next) => {
  try {
    const id = req.params.id;

    const rowCount = await deleteLikedRecipes(id);
    if (!rowCount) {
      return response(res, [], 500, "FAILED DELETE LIKED RECIPE DATA");
    }
    response(res, [], 200, "SUCCESS DELETE LIKED RECIPE DATA");
  } catch (error) {
    console.log(error);
    next(createError.InternalServerError());
  }
};
