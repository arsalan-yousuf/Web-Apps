const express = require("express");
const { check } = require("express-validator");
const { validationResult } = require("express-validator");
const mongoose = require('mongoose');
const multer = require('multer');
const { v1: uuidv1 } = require("uuid");
const router = express.Router();
const HttpError = require("../models/http-error");
const Place = require("../models/place");
const User = require("../models/user");
const authenticate = require('../middlewares/authenticate');
const fs = require('fs');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const upload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../uploads/images/');
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuidv1() + '.' + ext);
    }
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
  }
});

router.get("/:id", async (req, res, next) => {
  const placeId = req.params.id;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError("Something went wrong while getting place", 500));
  }
  if (!place) {
    return next(new HttpError("Place does not exist", 404));
  }
  res.json({ place: place.toObject({ getters: true }) });
});

// now downwards, only authentic requests will be entertained (with token)
router.use(authenticate);

// adding a place
router.post(                      //image is not getting uploaded in uploads/images, and also no any error thrown
  "/",
  upload.single('image'),
  [
    check("title").isLength({ min: 5 }),
    check("description").not().isEmpty(),
    check("image").not().isEmpty(),
    check("creator").not().isEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log('isEmpty');
      return next(new HttpError("Any input is invalid", 422));
    } else {
      const { title, description, image, creator } = req.body;
      // dummy_places.push({ id, title });
      console.log('Hello')
      res.json(req.body);
      let user;
      try {
        user = await User.findById(creator)
      } catch (error) {
        return next(new HttpError('Error while creating place, try again!', 500));
      }
      if (user) {
        const createPlace = new Place({
          title,
          description,
          // image: req.file.path,              // multer is not adding image to uploads/images
          image,
          creator
        });
        try {
          const sess = await mongoose.startSession();
          sess.startTransaction();
          await createPlace.save({ session: sess });
          user.places.push(createPlace);
          await user.save({ session: sess });
          await sess.commitTransaction();
        } catch (error) {
          return next(new HttpError("Problem while creating place, try again", 500));
        }
        res.status(201).json({ place: createPlace.toObject({ getters: true }), user: user.toObject({ getters: true }) });
      }
      else {
        return next(new HttpError("Identified user doesn't exist", 422))
      }
    }
  }
);

//getting a place by userId
router.get("/users/:id", async (req, res, next) => {
  const userId = req.params.id;
  let user;
  try {
    user = await User.findById(userId).populate('places');
  } catch (error) {
    return next(new HttpError("Unable to find place by user", 500));
  }
  if (!user || user.places.length === 0) {
    return next(new HttpError("Place by user doesn't exist", 404));
  }
  res.json({ places: user.places.map((p) => p.toObject({ getters: true })) });

});


//updating a place by its id
router.patch(
  "/:id",
  [
    check("title").isLength({ min: 5 }),
    check("description").not().isEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { title, description } = req.body;
      const placeId = req.params.id;
      let place;
      try {
        place = await Place.findById(placeId);
      } catch (error) {
        return next(new HttpError("Something went wrong while getting place", 500));
      }
      if (!place) {
        return next(new HttpError("Place does not exist", 404));
      }
      if(place.creator.toString() !== req.userData.userId){
        return next(new HttpError('You are not allowed to update this place',403))
      }

      place.title = title;
      place.description = description;

      try {
        await place.save();
      }
      catch (error) {
        return next(new HttpError('Unable to update place', 500));
      }
      res.status(200).json({ place: place.toObject({ getters: true }) });
    } else {
      throw new HttpError("Any input is invalid", 422);
    }
  }
);

//deleting a place by its id
router.delete("/:id", async (req, res, next) => {
  const placeId = req.params.id;
  let place;
  try {
    place = await Place.findById(placeId).populate('creator')
  } catch (error) {
    return next(new HttpError('Unable to get place by id, try again', 500))
  }
  if(place.creator.id !== req.userData.userId){
    return next(new HttpError('You are not allowed to delete this place',403))
  }
  const imgPath = place.image;

  if (!place) {
    return next(new HttpError("Place doesn't exist", 401))
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess })
    await sess.commitTransaction();
  } catch (error) {
    return next(new HttpError('Place not deleted, try again', 500))
  }

  fs.unlink(imgPath, err=> {
    console.log(err)
  })
  res.status(200).json({ message: `place with id ${req.params.id} deleted` });
});

module.exports = router;
