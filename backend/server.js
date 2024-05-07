// Importing Node Modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const users = require("./models/users");
const userController = require("./controllers/userController");
const passport = require("passport");
const session = require("express-session");
const localStrategy = require("passport-local");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcrypt");
const products = require("./models/products");

app.use(
  session({
    secret: process.env.SessionSecret,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://abhinav:${process.env.password}@ecommercev1.4k1rym2.mongodb.net/?retryWrites=true&w=majority&appName=ecommerceV1`,
      touchAfter: 24 * 3600,
    }),
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  users.find({ _id: user._id }).then((data) => {
    done(null, data[0]);
  });
});

passport.use(
  new localStrategy(function (username, password, done) {
    users.find({ username: username }).then((data) => {
      if (data.length > 0) {
        if (data[0].password == password) {
          done(null, data[0]);
        } else {
          done(null, false);
        }
      } else {
        done(null, false);
      }
    });
  })
);

// Middleware
app.use(express.urlencoded());
app.use(express.static("public"));
app.set("view engine", "ejs");

// Routes
app.use("/user", userController);

// Route Handlers
app.get(
  "/",
  (req, res, next) => {
    if (req.isAuthenticated()) {
      req.body.isLoggedIn = true;
      next();
    } else {
      req.body.isLoggedIn = false;
      next();
    }
  },
  (req, res) => {
    console.log(req.body.isLoggedIn);
    res.render("home", { isLoggedIn: req.body.isLoggedIn });
  }
);
app.get("/product", (req, res) => {
  res.render("product");
});

app.get("/products", (req, res) => {
  products.find({}).then((data) => {
    console.log(data);
    res.render("products", { products: data });
  });
});

//Starting the server
app.listen(2000, () => {
  console.log("Server up and running");
});
