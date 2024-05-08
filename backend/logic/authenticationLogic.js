const passport = require("passport");
const session = require("express-session");
const localStrategy = require("passport-local");
const MongoStore = require("connect-mongo");
require("dotenv").config();
const users = require("../models/users");
const bcrypt = require("bcrypt");

let signupLogic = async (req, res) => {
    const data = {
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
    }
    const existingUser = await users.findOne({email:data.email});
    if (existingUser) {
        res.redirect("/user/login")
    } else{
        const saltRounds = 10;
        const hashedPass = await bcrypt.hash(data.password , saltRounds);
        data.password = hashedPass;
        const user = await users.insertMany(data).then((info, err) => {
            if (err) {
                res.send(err);
            } else {
                console.log(info)
                res.redirect("/user/login");
            }
        });;
    }
}

let loginLogic = async (req, res) => {
    const { email, password } = req.body;
    const user = await users.findOne({ email: email });
    if (!user) {
        return res.redirect("/user/login");
    }
    bcrypt.compare(password, user.password, (err, result) => {
        if (err || !result) {
        return res.redirect("/user/login");
        }
        req.login(user, (err) => {
        if (err) {
            console.error(err);
            return res.redirect("/user/login");
        }
        return res.redirect("/");
        });
    });
}

module.exports = {loginLogic, signupLogic}