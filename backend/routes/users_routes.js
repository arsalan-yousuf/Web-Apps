const express = require("express");
const { check, validationResult } = require("express-validator");
const multer = require('multer');
// const uuid = require("uuid/v4");
// const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const HttpError = require("../models/http-error");
const User = require("../models/user");

const Multer = multer({});

// const dummy_users = [
//   {
//     id: "u1",
//     name: "Arsalan",
//     email: "test@test.com",
//     password: "test123",
//   },
// ];

router.get("/", async (req, res, next) => {
  let users;
  try {
    users =  await User.find({}, 'name email places');
  } catch (error) {
    return next(new HttpError('Unable to get users', 500))
  }
  res.json({ users: users.map(u => u.toObject({ getters: true })) });
});

//user signup
router.post(
  "/signup",
  Multer.single('image'),
  [
    check("name").not().isEmpty(),
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
    check("image").not().isEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      // const emailExists = dummy_users.find(
      //   (user) => user.email === req.body.email
      // );
      let alreadyExists;
      try {
        alreadyExists = await User.findOne({ email: req.body.email })
      } catch (error) {
        return next(new HttpError('Unable to check if email existing', 500))
      }
      if (alreadyExists) {
        return next(new HttpError('Email already registered, Login instead', 422))
      }
      const createdUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        image: req.body.image,
        places: []
      });
      try {
        await createdUser.save()
      } catch (error) {
        return next(new HttpError('Signup failed, try again', 500))
      }
      // dummy_users.push(newUser);
      res.status(201).json({ user: createdUser.toObject({ getters: true }) });  
      // else {
      //   throw new HttpError("Email already registered", 422);
      // }
    } else {
      return next(new HttpError("Any input is invalid", 422));
    }
  }
);


// user login
router.post(
  "/login",
  [check("email").isEmail(), check("password").isLength({ min: 6 })],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { email, password } = req.body;
      // const getUser = dummy_users.find((user) => user.email === email);
      let getUser;
      try {
        getUser = await User.findOne({ email: email })
      } catch (error) {
        return next(new HttpError('Unable to check if email exists', 500))
      }
      if (getUser && getUser.email === email) {
        if (getUser.password === password) {
          res.status(200).json({ name: getUser.name, email: getUser.email });
        } else {
          return next(new HttpError("Incorrect password!", 401));
        }
      } else {
        return next(new HttpError("Email not registered", 401));
      }
    } else {
      return next(new HttpError("Any input is invalid", 422));
    }
  }
);

module.exports = router;
