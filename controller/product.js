const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncError = require("../middleware/catchAsyncError");
const router = express.Router();
const Product = require("../model/product");
const Order = require("../model/order");
const Shop = require("../model/shop");
const cloudinary = require("cloudinary").v2;
const ErrorHandler = require("../utils/ErrorHandler");
const { upload } = require("../multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


router.post(
  "/upload-images",
  catchAsyncError(async (req, res, next) => {
    try {
      if (!req.files) {
        return res.status(400).send("No files were uploaded.");
      }
      let files = req.files.images;

      if (!Array.isArray(files)) {
        files = [files];
      }
      let imageUrls = [];
      for (let file of files) {
        try {
          const result = await cloudinary.uploader.upload(file.tempFilePath);
          imageUrls.push(result.url);
        } catch (error) {
          console.error("Error uploading to Cloudinary:", error);
          return res.status(500).send("Failed to upload one or more images.");
        }
      }
      res.send({ imageUrls });
    } catch (error) {
      console.log(error);
    }
  })
);


router.post(
  "/createProducts",
  catchAsyncError(async (req, res, next) => {
    try {
      const shop = await Shop.findOne({ _id: req.body.shopId });
      if (!shop) {
        return next(new ErrorHandler("shopId is invalid", 400));
      } else {
       
        const productData = req.body;
        productData.shop = shop;

        // create product
        const product = await Product.create(productData);

        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products of a shop
router.get(
  "/getAllProductShop/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete product of a shop
router.delete(
  "/deleteShopProduct/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return next(new ErrorHandler("Product is not found with this id", 404));
      }

      // Define a function to delete product images
      const deleteProductImages = async (images) => {
        for (let i = 0; i < images.length; i++) {
          // Perform deletion logic for each image (e.g., removing from storage)
          // Replace the following line with your custom image deletion logic
          // Example: fs.unlinkSync(images[i].path);
        }
      };

      // Call the custom function to delete product images
      await deleteProductImages(product.images);

      await product.remove();

      res.status(201).json({
        success: true,
        message: "Product Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products
router.get(
  "/getAllProducts",
  catchAsyncError(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

router.get(
  "/getshops",
  catchAsyncError(async (req, res, next) => {
    try {
      const shop = await Shop.findOne({ id: req.body.id });
      if (!shop) return next(new ErrorHandler("shopId is invalid", 400));
      res.status(200).send(shop);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  })
);

module.exports = router;
