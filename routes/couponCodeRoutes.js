const express = require("express");
const {
  createCoupon,
  getCoupon,
  deleteCoupon,
  getCouponValue,
} = require("../controller/couponCodeController");
const router = express.Router();
const { isSeller } = require("../middleware/auth");

router.post("/createCouponCode", isSeller, createCoupon);

router.get("/getAllCoupon/:id", isSeller, getCoupon);

router.delete("/deleteAllCoupon/:id", isSeller, deleteCoupon);

router.get("/getAllCouponsValue/:name", getCouponValue);

module.exports = router;
