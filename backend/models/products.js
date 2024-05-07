const mongoose = require("mongoose");
require("dotenv").config();

const schema = new mongoose.Schema({
  productName: String,
  imageUrl: String,
  price: String,
  color: String,
  category: String,
  group: String,
});

module.exports = mongoose.model("product", schema);
