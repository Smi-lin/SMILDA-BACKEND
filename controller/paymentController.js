const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncError");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post(
  "/process",
  catchAsyncErrors(async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
      metadata: {
        company: "Smilda",
      },
    });
    console.log(myPayment);
    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
  })
);

router.get(
  "/stripeApiKey",
  catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
  })
);

module.exports = router;
