const express = require("express")
const router = express.Router();
const passport = require("passport")
const session = require("express-session")
const localStrategy = require("passport-local")
const MongoStore = require("connect-mongo")
require("dotenv").config();
const users = require("../models/users")


router.use(session({
    secret: process.env.SessionSecret,
    store: new MongoStore({
        mongoUrl: `mongodb+srv://${process.env.username}:${process.env.password}@ecommercev1.4k1rym2.mongodb.net/?retryWrites=true&w=majority&appName=ecommerceV1`,
        touchAfter: 24 * 3600
    }),
    resave: true,
    saveUninitialized: false,
    cookie: { secure: true , maxAge: 13 * 24 * 3600000}
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    users.find({_id: user._id}),then(data => {
        done(null, user[0])
    })
});

passport.use(new localStrategy(
    function(username, password, done) {
      users.find({ username: username }).then((data, err) => {
        if (err) { return done(err); }
        if (data.length == 0) { return done(null, false); }
        if (!data[0].password == password) { return done(null, false); }
        return done(null, data[0]);
      });  
    }
));
   


router.route("/signup")
.get(
    (req, res,next) => {
        if (req.isAuthenticated == true) {
            res.redirect("/")
        } else {
            next()
        }
    },
    (req, res) => {
        res.render("signup")
    }
)

router.route("/signup")
.post(
    (req, res) => {
        users.insertMany([{email: req.body.email, password: req.body.password, username: req.body.username}]).then((data, err) => {
            if (err) {
                res.send(err)
            } else {
                res.redirect("/user/login")
            }
        })
    }
)

router.post('/login', 
  passport.authenticate('local', { successRedirect: "/", failureRedirect: '/user/login' }),
  function(req, res) {
    res.redirect('/');
});

router.get("/login", (req, res,next) => {
    if (req.isAuthenticated == true) {
        res.redirect("/")
    } else {
        next()
    }
},(req, res) => {
    
        res.render("login")
    
})

module.exports = router