const express = require("express");
const { check } = require("express-validator");
const { validationResult } = require("express-validator");
const mongoose = require('mongoose');
const multer = require('multer');

const router = express.Router();
const HttpError = require("../models/http-error");
const Place = require("../models/place");
const User = require("../models/user");

const Multer = multer({});

// let dummy_places = [
//   {
//     id: "1",
//     title: "Place One",
//   },
//   {
//     id: "2",
//     title: "Place Two",
//   },
// ];

// adding a place
router.post(
  "/",
  Multer.single('image'), 
  [
    check("title").isLength({ min: 5 }),
    check("description").not().isEmpty(),
    check("image").isURL(),
    check("creator").not().isEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new HttpError("Any input is invalid", 422));
    } else {
      const { title, description, image, creator } = req.body;
      // dummy_places.push({ id, title });

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



  // another method of getting only those places match with userId

  // let place;
  // try {
  //   place = await Place.find({ creator: userId });
  // } catch (error) {
  //   return next(new HttpError("Unable to find place by user", 500));
  // }
  // if (!place || place.length === 0) {
  //   return next(new HttpError("Place by user doesn't exist", 404));
  // }
  // res.json({ place: place.map((p) => p.toObject({ getters: true })) });
});

//getting a place by its id
router.get("/:id", async (req, res, next) => {
  const placeId = req.params.id;
  // const place = dummy_places.find((p) => {
  //   return p.id === placeId;
  // });
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError("Something went wrong while getting place", 500));
  }
  if (!place) {
    // res.status(404).json({message: 'Place does not exist'})
    // const error = new Error('Place does not exist!')
    // error.code = 404
    // throw error
    return next(new HttpError("Place does not exist", 404));
  }
  res.json({ place: place.toObject({ getters: true }) });
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
      // let placeIndex;
      // const updatedPlace = dummy_places.find((item, index) => {
      //   if (item.id === placeId) {
      //     placeIndex = index;
      //     return item;
      //   }
      // });
      // const placeIndex = dummy_places.findIndex(p => p.id === placeId);
      place.title = title;
      place.description = description;
      // console.log(dummy_places);

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
  // dummy_places = dummy_places.filter((p) => p.id != req.params.id);
  const placeId = req.params.id;
  let place;
  try {
    place = await Place.findById(placeId).populate('creator')
  } catch (error) {
    return next(new HttpError('Unable to get place by id, try again', 500))
  }
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
  res.status(200).json({ message: `place with id ${req.params.id} deleted` });
});

module.exports = router;
