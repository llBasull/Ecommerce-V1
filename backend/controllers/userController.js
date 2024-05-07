const express = require("express");
const router = express.Router();
const passport = require("passport");
const session = require("express-session");
const localStrategy = require("passport-local");
const MongoStore = require("connect-mongo");
require("dotenv").config();
const users = require("../models/users");
const bcrypt = require("bcrypt");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;

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
  done(null, user._id); // Serialize the user ID
});

passport.deserializeUser((id, done) => {
  users.findById(id).then((data) => {
    done(null, data);
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

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientId,
      clientSecret: process.env.clientSecret,
      callbackURL: "http://localhost:2000/user/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      users.find({ googleId: profile.id }).then((data) => {
        if (data.length == 0) {
          users.insertMany([{ googleId: profile.id }]).then((data) => {
            return cb(null, data[0]);
          });
        } else {
          return cb(null, data);
        }
      });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.appId,
      clientSecret: process.env.appSecret,
      callbackURL: "http://localhost:2000/user/auth/facebook/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      users.find({ facebookId: profile.id }).then((data) => {
        if (data.length == 0) {
          users.insertMany([{ facebookId: profile.id }]).then((data) => {
            return cb(null, data[0]);
          });
        } else {
          return cb(null, data);
        }
      });
    }
  )
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
  users
    .insertMany([
      {
        email: req.body.email,
        password: req.body.password,
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

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/user/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/user/login" })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/user/login" }),
  function (req, res) {
    res.redirect("/");
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
