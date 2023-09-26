const express = require("express");
const catchAsyncError = require("../middleware/catchAsyncError");
const Shop = require("../model/shop");
const Event = require("../model/events");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller, isAdmin, isAuthenticated } = require("../middleware/auth");
const router = express.Router();
const { upload } = require("../multer");
const cloudinary = require("cloudinary").v2;
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
  "/createEvent",
  catchAsyncError(async (req, res, next) => {
    try {
      const shop = await Shop.findOne({ _id: req.body.shopId });

      if (!shop) {
        return next(new ErrorHandler("ShopId is invalid", 400));
      } else {

        const eventData = req.body;
        // productData.images = imagesLinks;
        productData.shop = shop;

        // Create the event
        const event = await Event.create(productData);

        res.status(201).json({
          success: true,
          event,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all events
router.get("/getAllEvents", async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});


// get all events of a shop
router.get(
  "/getAllEventShop/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const events = await Event.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);


router.delete(
  "/deleteShopEvent/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return next(new ErrorHandler("Event is not found with this id", 404));
      }

      // Define a function to delete event images
      const deleteEventImages = async (images) => {
        for (let i = 0; i < images.length; i++) {
          // Perform deletion logic for each image (e.g., removing from storage)
          // Replace the following line with your custom image deletion logic
          // Example: fs.unlinkSync(images[i].path);
        }
      };

      // Call the custom function to delete event images
      await deleteEventImages(event.images);

      await event.remove();

      res.status(201).json({
        success: true,
        message: "Event Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;
