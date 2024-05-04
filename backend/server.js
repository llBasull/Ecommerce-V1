// Importing Node Modules
const express = require("express")
const app = express();
const mongoose = require("mongoose")
require("dotenv").config()
const users = require("./models/users")
const userController = require("./controllers/userController")

// Connecting to the database
mongoose.connect(`mongodb+srv://${process.env.username}:${process.env.password}@ecommercev1.4k1rym2.mongodb.net/?retryWrites=true&w=majority&appName=ecommerceV1`)
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err)
    })

// Middleware
app.use(express.urlencoded())
app.use(express.static("public"))
app.set('view engine', 'ejs')

// Routes
app.use("/user", userController)

// Authentication Middleware
app.use("/", (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect("/user/signup")
    }
})

// Route Handlers
app.get("/", (req, res) => {
    res.send("hi")
})

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

//Starting the server
app.listen(2000, () => {
    console.log("Server up and running")
})
