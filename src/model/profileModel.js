const pool = require("../config/db");

const getProfile = (id) => {
  console.log("get data user dari get profile ");
  return pool.query("SELECT * FROM users WHERE id_user=$1", [id]);
};

module.exports = {
  getProfile,
};
