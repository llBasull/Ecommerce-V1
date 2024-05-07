const express = require("express");
const router = express.Router();
const passport = require("passport");
const session = require("express-session");
const localStrategy = require("passport-local");
const MongoStore = require("connect-mongo");
require("dotenv").config();
const users = require("../models/users");
const bcrypt = require("bcrypt");

router.use(
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

router.use(passport.initialize());
router.use(passport.session());

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
    users.find({ username: username }).then(async (data) => {
      if (data.length > 0) {
        bcrypt.compare(password, data[0].password).then((result) => {
          if (result == true) {
            done(null, data[0]);
          } else {
            done(null, false);
          }
        });
      } else {
        done(null, false);
      }
    });
  })
);

router.route("/signup").get(
  (req, res, next) => {
    if (req.isAuthenticated() == true) {
      res.redirect("/");
    } else {
      next();
    }
  },
  (req, res) => {
    res.render("signup");
  }
);

router.route("/signup").post(async (req, res) => {
  bcrypt.hash(req.body.password, 3).then((hash) => {
    users
      .insertMany([
        {
          email: req.body.email,
          password: hash,
          username: req.body.username,
        },
      ])
      .then((data, err) => {
        if (err) {
          res.send(err);
        } else {
          res.redirect("/user/login");
        }
      });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
  }),
  function (req, res) {
    res.redirect("/");
  }
);

router.get(
  "/login",
  (req, res, next) => {
    console.log(req.isAuthenticated());
    next();
  },
  (req, res, next) => {
    if (req.isAuthenticated()) {
      res.redirect("/");
    } else {
      next();
    }
  },
  (req, res) => {
    res.render("login");
  }
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
