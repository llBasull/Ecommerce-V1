const express = require("express");
const { default: Stripe } = require("stripe");
const app = express();
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY); // Ensure correct environment variable name

app.listen(3000);
app.use(express.static("public"));
app.use(express.json()); // Enables parsing of JSON request bodies

const productsInfo = await p[roduct]

app.get("/", (req, res) => {
  res.send("index.html");
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const lineItems = await Promise.all(req.body.items.map(async (item) => {
      const product = productsInfo.find((productItem) => productItem.id === item.id);
      if (!product) {
        throw new Error("Invalid product ID");
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
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: "http://localhost:3000/checkoutSuccess",
      cancel_url: "http://localhost:3000/checkoutCancel",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});
