const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { default: mongoose, mongo } = require("mongoose");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));

//MONGOOSE METHODS
mongoose.connect(process.env.MONGO_URI);

const userSchema = mongoose.Schema({
  username: "String",
  //_id is created automatically
});
const User = mongoose.model("User", userSchema);

//EXPRESS METHODS
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  //get user name from body parser
  // create new user
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
