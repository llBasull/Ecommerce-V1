const mongoose = require("mongoose");
require("dotenv").config();

const schema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  googleId: String,
  facebookId: String,
});

module.exports = mongoose.model("user", schema);
