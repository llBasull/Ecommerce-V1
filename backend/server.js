// Importing Node Modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const users = require("./models/users");
const userController = require("./controllers/userController");

// Middleware
app.use(express.urlencoded());
app.use(express.static("public"));
app.set("view engine", "ejs");

// Routes
app.use("/user", userController);

// Authentication Middleware
app.use("/", (req, res, next) => {
  if (req.isAuthenticated == true) {
    next();
  } else {
    res.redirect("/user/signup");
  }
});

// Route Handlers
app.get("/", (req, res) => {
  res.send("hi");
});

//Starting the server
app.listen(2000, () => {
  console.log("Server up and running");
});
