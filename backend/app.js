const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require('fs');
const imgPath = require('path');

const placeRouter = require("./routes/places_routes");
const userRouter = require("./routes/users_routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(express.raw());

//for CORS error handling
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');

  next();
})


app.use("/api/places", placeRouter); // api/places/...
app.use("/api/users", userRouter); // api/users/...

app.use((req, res, next) => {
  // Route not found handler
  const error = new HttpError("Route not found", 404);
  throw error;
});

app.use('/uploads/images', express.static(imgPath.join('uploads', 'images')))

app.use((error, req, res, next) => {
  // this is only triggered in case of any error
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err)
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
});

app.use((req, res, next) => {
  res.send("<h1>Index</h1>");
});


mongoose
  .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8lad6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
  .then(() => {
    console.log('Database connected');
    console.log('Listening on localhost:5000')
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
