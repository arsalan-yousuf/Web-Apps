const express = require("express");
const { check, validationResult } = require("express-validator");
const multer = require('multer');
const { v1: uuidv1 } = require("uuid");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const HttpError = require("../models/http-error");
const User = require("../models/user");
const authenticate = require('../middlewares/authenticate');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}

const Multer = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images')
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype]
      cb(null, uuidv1() + '.' + ext);
    }
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mimetype')
    cb(error, isValid)
  }
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
    console.log(req.body);
    const errors = validationResult(req);
    if (errors.isEmpty()) {

      let alreadyExists;
      try {
        alreadyExists = await User.findOne({ email: req.body.email })
      } catch (error) {
        return next(new HttpError('Unable to check if email existing', 500))
      }
      if (alreadyExists) {
        return next(new HttpError('Email already registered, Login instead', 422))
      }
      let hashedPass;
      try {
        hashedPass = await bcrypt.hash(req.body.password, 12);
      }
      catch (err) {
        return next(new HttpError('Unable to hash password', 500))
      }

      const createdUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPass,
        // image: req.file.path,        // multer is not adding image to uploads/images
        image: req.body.image,
        places: []
      });
      try {
        await createdUser.save()
      } catch (error) {
        return next(new HttpError('Signup failed, try again', 500))
      }
      // dummy_users.push(newUser);
      let token;
      try {
        token = jwt.sign({ userId: createdUser.id, email: createdUser.email }, process.env.JWT_KEY, { expiresIn: '1h' });
      }
      catch (error) {
        return next(new HttpError('Token generation failed', 500))
      }
      // res.status(201).json({ user: createdUser.toObject({ getters: true }) });
      res.status(201).json({ userId: createdUser.id, name: createdUser.name, email: createdUser.email, token: token });
    } else {
      return next(new HttpError("Any input is invalid", 422));
    }
  }
);


// user login
router.post(                            // body mai data nahi aa raha
  "/login",
  [check("email").isEmail(), check("password").isLength({ min: 6 })],
  async (req, res, next) => {
    console.log(req)
    console.log(req.body);
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

      let isValidPassword;
      if (getUser) {
        try {
          isValidPassword = await bcrypt.compare(password, getUser.password)
        }
        catch (error) {
          return next(new HttpError('Try again', 500));
        }
        if (isValidPassword) {
          let token;
          try {
            token = jwt.sign({ userId: getUser.id, email: getUser.email }, process.env.JWT_KEY, { expiresIn: '1h' });
          }
          catch (error) {
            return next(new HttpError('Token generation failed', 500))
          }
          // res.status(201).json({ user: createdUser.toObject({ getters: true }) });
          res.status(201).json({ userId: getUser.id, name: getUser.name, email: getUser.email, token: token });
        } else {
          return next(new HttpError("Incorrect password!", 401));
        }
      } else {
        return next(new HttpError("Email not registered", 401));
      }
    } else {
      console.log(errors);
      return next(new HttpError("Any input is invalid", 422));
    }
  }
);

// now downwards, only authentic requests will be entertained (with token)
router.use(authenticate);

// getting users list
router.get("/", async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, 'name email places');
  } catch (error) {
    return next(new HttpError('Unable to get users', 500))
  }
  res.json({ users: users.map(u => u.toObject({ getters: true })) });
});

module.exports = router;
