// Importing Basic Node Modules
const express = require("express");
const router = express.Router();
require("dotenv").config();

// Importing Database Models
const products = require("../models/products");
const users = require("../models/users");

let {homepage_middleware} = require("../middleware/authMiddleware")

// Route Handlers
router.get(
  "/",
  homepage_middleware,
  (req, res) => {
    console.log(req.body.isLoggedIn);
    res.render("home", { isLoggedIn: req.body.isLoggedIn });
  }
);
router.get("/product/", (req, res) => {
  products.find({ productName: req.query.id }).then(data => {
    res.render("product",{
      product: data[0]
    });
  })
});

router.get("/products", (req, res) => {
  products.find({}).then((data) => {
    res.render("products", { products: data });
  });
});

router.post("/product-search", (req, res) => {
  products.find({ productName: RegExp(req.body.query, "i") }).then(productList => {
    res.render("products", { products: productList });
  })
})

router.get("/about", (req, res) => {
    res.render("about",);
});

module.exports = router