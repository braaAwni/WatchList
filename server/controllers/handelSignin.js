/* eslint-disable no-unused-vars */
const schema = require("../utils/validation/signinValiadtion");
const bcrypt = require("bcryptjs");
const { getUsers, getUserByEmail } = require("../database/queries");
const jwt = require("jsonwebtoken");

const signin = (req, res) => {
  const { password } = req.body;
  schema
    .validateAsync(req.body)
    .then((value) => getUserByEmail(value.email))
    .then((data) => {
      if (!data.rows.length) {
        res.status(403).json("USER NOT FOUND!");
        
      } else {
        bcrypt.compare(password, data.rows[0].password).then((value) => {
          if (value === false) {
            res.status(403).json("PASSWORD ERROR!");
          } else {
            jwt.sign(
              { id: data.rows[0].id },
              process.env.privateKey,
              (err, token) => {
                if (err) {
                  console.log(err);
                } else {
                  res.cookie("id", token).redirect("/home");
                }
              }
            );
          }
        });
      }
    });
};

module.exports = signin;
