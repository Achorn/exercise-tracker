const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { default: mongoose, mongo } = require("mongoose");
require("dotenv").config();

//MIDDLEWARE
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

//MONGOOSE METHODS
mongoose.connect(process.env.MONGO_URI);

const userSchema = mongoose.Schema({
  username: String,
  //_id is created automatically
});
const User = mongoose.model("User", userSchema);

const exerciseSchema = mongoose.Schema({
  username: String,
  description: String,
  duration: Number,
  date: String,
  user_id: String,
});

const Exersize = mongoose.model("Exersize", exerciseSchema);
//EXPRESS METHODS
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  if (!req.body.username) res.json({ error: "no username" });
  let newUser = new User({ username: req.body.username });

  newUser
    .save()
    .catch((err) => {
      res.json({ error: err });
    })
    .then((data) => {
      res.json({ username: data.username, _id: data._id });
    });
});

app.get("/api/users", (req, res) => {
  //get all users
  User.find({}, "username _id")
    .catch((err) => res.json({ err: err }))
    .then((data) => {
      res.json(data);
    });
});

app.post("/api/users/:_id/exercises", (req, res) => {
  // check for valid user Id
  User.findById(req.params._id)
    .catch((err) => res.json({ err: err }))
    .then((userData) => {
      let date = Date.parse(req.body.date);
      if (!date) date = new Date();
      else date = new Date(date);

      let newExersize = Exersize({
        username: userData.username,
        description: req.body.description || "",
        duration: req.body.duration || 0,
        date: date.toDateString(),
        user_id: userData._id,
      });
      newExersize
        .save()
        .catch((err) => res.json({ error: err }))
        .then((data) => {
          console.log("problem officer?");
          console.log(data);
          res.json({
            _id: data.user_id,
            username: data.username,
            date: data.date,
            duration: data.duration,
            description: data.description,
          });
        });
    });
});

app.get("/api/users/:_id/logs", (req, res) => {
  console.log("hello");
  User.findById(req.params._id)
    .catch((err) => res.json({ err: err }))
    .then((userData) => {
      Exersize.find({ user_id: req.params._id })
        .catch((err) => res.json({ err: err }))
        .then((data) =>
          res.json({
            _id: userData._id,
            username: userData.username,
            count: data.length,
            log: data,
          })
        );
    });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
