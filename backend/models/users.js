const mongoose = require("mongoose");

const schema = {
    username: String,
    password: String,
    email: String
}

module.exports = mongoose.model("user", schema)