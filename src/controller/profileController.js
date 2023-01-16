const createError = require("http-errors");
const { verifyJWT } = require("../helper/jwt");
const response = require("../helper/response");
const { getProfile } = require("./../model/profileModel");
const { getRecipeUser } = require("./../model/recipe");

module.exports.getProfie = async (req, res, next) => {
  try {
    const payload = req.payload;
    const {
      rows: [data],
    } = await getProfile(payload);
    delete data.password;
    return response(res, data, 200, "get profile success");
  } catch (error) {
    console.log(error);
  }
};
module.exports.getRecipebyProfile = async (req, res, next) => {
  try {
    const { id_user } = req.payload;
    const {
      rows: [data],
    } = await getProfile(id_user);
    const { rows } = await getRecipeUser(data.id_user);
    return response(res, rows, 200, "get recipe by profile success");
  } catch (error) {
    console.log(error);
  }
};
