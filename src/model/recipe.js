const pool = require("../config/db");

const addRecipe = ({ id, title, image, ingredient, video, id_user }) => {
  console.log("adding some recipe");
  console.log("photo", image);

  return new Promise((resolve, reject) =>
    pool.query(
      `INSERT INTO recipes (id, title, image, ingredient, video, id_user) values ('${id}','${title}', '${image}', '${ingredient}', '${video}', '${id_user}')`,
      (e, result) => {
        if (!e) {
          resolve(result);
        } else {
          reject(e);
        }
      }
    )
  );
};

const getRecipeDetail = (id) => {
  console.log("searching detail ...");
  return new Promise((resolve, reject) =>
    pool.query(`SELECT * FROM recipes WHERE id = $1`, [id], (e, result) => {
      if (!e) {
        resolve(result);
      } else {
        reject(e);
      }
    })
  );
};
const getRecipe = ({ search, orderby, order, limit, offset }) => {
  if (!search) {
    return pool.query(
      `SELECT * FROM recipes ORDER BY ${orderby} ${order} LIMIT ${limit} OFFSET ${offset}`
    );
  }
  return pool.query(
    `SELECT * FROM recipes WHERE title ILIKE '%${search}%' ORDER BY ${orderby} ${order} LIMIT ${limit} OFFSET ${offset}`
  );
};
const countData = (search) => {
  if (!search) {
    return pool.query("SELECT COUNT(*) AS total FROM recipes");
  }
  return pool.query(
    `SELECT COUNT(*) AS total FROM recipes WHERE title ILIKE '%${search}%'`
  );
};
const updateRecipe = ({ id, title, image, ingredient, video, id_user }) => {
  return pool.query(
    "UPDATE recipes SET title = COALESCE($1, title), image = COALESCE($2, image), ingredient = COALESCE($3, ingredient), video = COALESCE($4, video), id_user = COALESCE($5, id_user), post_at = NOW() WHERE id = $6",
    [title, image, ingredient, video, id_user, id]
  );
};

const getRecipeUser = (id) => {
  console.log("searching Recipe from id");
  console.log("berhasil jalankan get recipe dari profile");
  return pool.query(`SELECT * FROM recipes WHERE id_user = $1`, [id]);
};

const addLikedRecipes = ({ id_recipe }, id_user) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO likes(id_recipe, id_user) VALUES ('${id_recipe}', '${id_user}')`,
      (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    );
  });
};

const addSavedRecipes = (data) => {
  const { id_user, id_recipe } = data;
  console.log("id user", id_user);
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO saved(id_user, id_recipe) VALUES ('${id_user}', '${id_recipe}')`,
      (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    );
  });
};

const getLikedRecipes = (id_user) => {
  console.log("id user from get liked", id_user);
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT likes.id, recipes.title, recipes.image, recipes.id from likes, recipes WHERE likes.id_user='$1' AND likes.id_recipe=recipes.id`,
      [id_user],
      (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    );
  });
};

const getSavedRecipes = (id_user) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT saved.id, recipes.title, recipes.image, recipes.id as recipe_id from saved, recipes WHERE saved.id_user = '${id_user}' AND saved.id_recipe= recipes.id`,
      (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    );
  });
};
const deleteRecipe = (id) => {
  return pool.query(`DELETE FROM recipes WHERE id = $1`, [id]);
};
const deleteSavedRecipes = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `DELETE FROM saved WHERE id_recipe = $1`,
      [id],
      (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    );
  });
};

const deleteLikedRecipes = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(`DELETE FROM likes WHERE id_recipe=$1`, [id], (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    });
  });
};

module.exports = {
  addRecipe,
  getRecipeDetail,
  getRecipe,
  countData,
  updateRecipe,
  deleteRecipe,
  getRecipeUser,
  addLikedRecipes,
  addSavedRecipes,
  getLikedRecipes,
  getSavedRecipes,
  deleteSavedRecipes,
  deleteLikedRecipes,
};
