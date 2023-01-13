const Pool = require("../config/db");
/*
id_user SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100), 
    phonenumber BIGINT, 
    password VARCHAR(30), 
    photo VARCHAR(255));
*/

const create = (data) => {
  const { id_user, name, email, phonenumber, password, otp } = data;
  return new Promise((resolve, reject) =>
    Pool.query(
      `INSERT INTO users(id_user, name, email, phonenumber, password,verif, otp ) VALUES('${id_user}', '${name}', '${email}', ${phonenumber}, '${password}', 0, '${otp}')`,
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

const findEmail = (email) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT * FROM users where email='${email}'`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};
const verification = (email) =>
  new Promise((resolve, reject) =>
    Pool.query(
      `UPDATE users SET verif=1 WHERE "email"='${email}'`,
      (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    )
  );

const searchUser = (email) => {
  console.log("searching users...");
  return Pool.query(`SELECT * FROM users WHERE email = '${email}';`);
};

const getProfile = (email) => {
  return new Promise((resolve, reject) => {
    Pool.query(
      `SELECT * FROM users WHERE email = '${email}';`,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
  });
};

const checkExisting = (emailID) => {
  return Pool.query(
    `SELECT COUNT(*) AS total FROM users WHERE email = '${emailID}';`
  );
};

const updateProfile = ({ photo }, email) => {
  return new Promise((resolve, reject) => {
    Pool.query(
      `UPDATE users SET photo='${photo}' WHERE email = '${email}';`,
      [photo],
      (err, result) => {
        if (!err) {
          console.log(result);
          resolve(result);
        } else {
          reject(new Error(err));
        }
      }
    );
  });
};

module.exports = {
  create,
  findEmail,
  verification,
  searchUser,
  getProfile,
  checkExisting,
  updateProfile,
};
