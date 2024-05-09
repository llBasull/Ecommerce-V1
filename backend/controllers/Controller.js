// Importing Basic Node Modules
const express = require("express");
const router = express.Router();
require("dotenv").config();

// Importing Database Models
const products = require("../models/products");
const users = require("../models/users");

let { homepage_middleware } = require("../middleware/authMiddleware")
router.use(express.json())

// Route Handlers
router.get(
  "/",
  homepage_middleware,
  (req, res) => {
    res.render("home", { isLoggedIn: req.body.isLoggedIn });
  }
);
router.get("/product/", async (req, res) => {
  let user = await users.find({ _id: req.session.passport.user });
  
  products.find({ productName: req.query.id }).then(data => {
    let inCart = false;
    user[0].cart.map(item => {
      console.log(item.productId == data[0]._id)
      if (item.productId == data[0]._id) {
        inCart = true
      } else {
        if (!inCart == true) {
          inCart = false
        }
      }
    })
    console.log(inCart)
    if (inCart) {
      res.render("product",{
          product: data[0],
          inCart: true
        });
    } else {
      res.render("product",{
          product: data[0],
          inCart: false
        });
    }
  })
});

router.get("/products", (req, res) => {
  products.find({}).then(async (data) => {
    res.render("products", { products: data });
  });
});

router.post("/product-search", (req, res) => {
  products.find({ productName: RegExp(req.body.query, "i") }).then(productList => {
    res.render("products", { products: productList });
  })
})

router.post("/addToCart", (req, res) => {
    let response = {}
    users.find({ _id: req.session.passport.user }).then(data => {
      let userCart = data[0].cart;
      if (userCart.length == 0) {
        userCart = [req.body]
        users.updateMany({ _id: req.session.passport.user }, { cart: userCart }).then(data => {
          console.log(data)
        })
        response = {status: "success", message: "Product Added to the cart"}
      } else if (userCart.length > 0) {
        let noDupplication = true;
        userCart.map(item => {
          if (item.productId == req.body.productId) {
            noDupplication = false
          } else if (item.productId == req.body.productId) {
            noDupplication = true      
          }
        })
        if (noDupplication == true) {
          userCart.push(req.body)
          users.updateMany({ _id: req.session.passport.user }, { cart: userCart }).then(data => console.log(data))
          response = {status: "success", message: "Product Added to the cart"}
        } else[
          response = {status: "error", message: "Product Already Exists"}
        ]
      }
      res.json(response)
  })
})

router.get("/about", (req, res) => {
    res.render("about",);
});

module.exports = router