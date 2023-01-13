const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { generateToken } = require("../helper/auth");
const { responses } = require("../middleware/common");
const {
  findEmail,
  create,
  verification,
  getProfile,
  checkExisting,
  updateProfile,
} = require("../model/user");
const email = require("../middleware/email");
const jwt = require("jsonwebtoken");
const Port = process.env.PORT;
const Host = process.env.HOST;

const UserController = {
  register: async (req, res, next) => {
    const {
      rows: [users],
    } = await findEmail(req.body.email);
    if (users) {
      return responses(res, 404, false, "Email already use", "register fail");
    }
    const digit = "012456789";
    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += digit[Math.floor(Math.random() * 10)];
    }
    const password = bcrypt.hashSync(req.body.password);
    const data = {
      id_user: uuidv4(),
      name: req.body.name,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      password,
      otp,
    };
    console.log(data);
    try {
      const result = await create(data);
      if (result) {
        console.log(result);
        const verifyUrl = `http://${Host}:${Port}/users/${req.body.email}/${otp}`;
        const sendEmail = email(data.email, otp, verifyUrl, data.name);
        if (sendEmail == "email not send") {
          return responses(res, 404, false, null, "register fail");
        }
        responses(
          res,
          200,
          true,
          { email: data.email },
          "Register success. Check your email to validation account!"
        );
      }
    } catch (e) {
      console.log(e);
      responses(res, 404, false, e, "Register fail usercontroller!");
    }
  },
  login: async (req, res, next) => {
    console.log("Email", req.body.email);
    console.log("Password", req.body.password);
    const {
      rows: [user],
    } = await findEmail(req.body.email);
    if (!user) {
      return responses(res, 404, false, null, "Email bot found");
    }
    if (user.verif == 0) {
      return responses(res, 404, false, null, "Email not verify");
    }

    const password = req.body.password;
    const validate = bcrypt.compareSync(password, user.password);
    if (!validate) {
      return responses(res, 404, false, null, "Wrong password");
    }
    delete user.password;
    delete user.otp;
    delete user.verif;
    const payload = {
      id_user: user.id_user,
      email: user.email,
    };
    console.log("payload=", payload);
    user.token = generateToken(payload);
    res.cookie("token", user.token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });
    responses(res, 200, false, user, "Login success");
  },
  otp: async (req, res, next) => {
    console.log("Email", req.body.email);
    console.log("Password", req.body.otp);
    const {
      rows: [user],
    } = await findEmail(req.body.email);
    if (!user) {
      return responses(res, 404, false, null, "Email not found");
    }
    if (user.otp == req.body.otp) {
      const result = await verification(req.body.email);
      return responses(res, 200, true, result, "Verification email success");
    }
    return responses(
      res,
      404,
      fail,
      null,
      "Otp not valid, please check your email!"
    );
  },

  getProfile: async (req, res, next) => {
    const email = req.payload.email;
    console.log(email);
    const {
      rows: [user],
    } = await getProfile(email);

    if (user === undefined) {
      res.json({
        message: "undefined user",
      });
      return;
    }
    delete user.password;
    return responses(res, 200, true, user, "get profile success");
  },

  updateUsers: async (req, res, next) => {
    const profile = {};
    const email = req.payload.email;
    const { photo } = req.files;
    profile.photo = photo ? photo.path : null;

    updateProfile(email, req.body)
      .then((data) => {
        responses(res, 200, true, data, "berhasil upload photo");
      })
      .catch((e) => responses(res, 404, false, e, "gagal upload photo"));
  },
  userLogout: (req, res, next) => {
    const data = {
      message: "logout success",
    };

    try {
      res.cookie("token", "", { maxAge: 1 });
      responses(res, 200, true, data, "Logout Successful");
    } catch (error) {
      console.log(error);
    }
  },

  deleteUsers: async (req, res, next) => {
    const emailID = req.params.emailid;

    try {
      const {
        rows: [count],
      } = await checkExisting(emailID);
      const result = parseInt(count.total);

      if (result === 0) {
        responses(
          res,
          404,
          false,
          null,
          "Data not found, you cannot edit the data which is not exist"
        );
      }

      usersModel.deleteUsers(emailID);
      responses(res, 200, true, emailID, "User data has just been deleted");
    } catch (error) {
      console.log(error);
      next(errorServer);
    }
  },
};

exports.UserController = UserController;
