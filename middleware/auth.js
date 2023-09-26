const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Shop = require("../model/shop");


exports.isSeller = catchAsyncError(async(req,res,next) => {
  const {seller_token} = req.cookies;
  if(!seller_token){
      return next(new ErrorHandler("Please login to continue", 401));
  }

  const decoded = jwt.verify(seller_token, process.env.JWT_SECRET);

  req.seller = await Shop.findById(decoded.id);

  next();
});
