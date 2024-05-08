const express = require("express");
const { default: Stripe } = require("stripe");
const app = express();
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY); // Ensure correct environment variable name

app.listen(3000);
app.use(express.static("public"));
app.use(express.json()); // Enables parsing of JSON request bodies

const products = [
  { id: 2122, productName: "Basic T Shirt", priceInCents: 211578 },
  { id: 3212, productName: "Basic Watch", priceInCents: 349304 }
];

app.get("/", (req, res) => {
  res.send("index.html");
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment", // For one-time purchases
      line_items: req.body.items.map((item) => {
        const product = products.find((productItem) => productItem.id === item.id); // Use find for efficient lookup
        if (!product) {
          return res.status(400).json({ error: "Invalid product ID" }); // Handle missing product
        }
        return {
          price_data: {
            currency: 'inr',
            product_data: {
              name: product.productName,
            },
            unit_amount: product.priceInCents,
          },
          quantity: item.quantity,
        };
      }),
      success_url: "http://localhost:3000/checkoutSuccess",
      cancel_url: "http://localhost:3000/checkoutCancel",
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "An error occurred" }); // Generic error message for the user
  }
});
