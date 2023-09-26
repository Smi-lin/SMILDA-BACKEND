const express = require("express");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const CouponCode = require("../model/CouponCode");

// CREATE COUPON CODE
const createCoupon = async (req, res, next) => {
  try {
    const isCouponCodeExist = await CouponCode.find({ name: req.body.name });

    console.log(req.body);

    if (isCouponCodeExist.length !== 0) {
      return next(new ErrorHandler("Coupon Code already exists!", 400));
    }

    const couponCode = await CouponCode.create(req.body);

    console.log(couponCode);

    res.status(201).json({
      success: true,
      couponCode,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

// GET ALL COUPON
const getCoupon = async (req, res, next) => {
  try {
    const couponCodes = await CouponCode.find({
      shop: {
        _id: req.params.id,
      },
    });

    res.status(201).json({
      success: true,
      couponCodes,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

const deleteCoupon = async (req, res, next) => {
  try {
    const couponCode = await CouponCode.findByIdAndDelete(req.params.id);

    if (!couponCode) {
      return next(new ErrorHandler("Coupon code dosen't exists!", 400));
    }
    res.status(201).json({
      success: true,
      message: "Coupon code deleted successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

const getCouponValue = async (req, res, next) => {
  try {
    const couponCode = await CouponCode.findOne({ name: req.params.name });

    res.status(200).json({
      success: true,
      couponCode,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
};

module.exports = {
  createCoupon,
  getCoupon,
  deleteCoupon,
  getCouponValue,
};
