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

module.exports = { create, findEmail, verification };
