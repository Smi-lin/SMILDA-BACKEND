const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require('express-fileupload');
const bodyParser = require("body-parser");
const cors = require("cors");
const ErrorHandler = require("./utils/ErrorHandler"); // Make sure this path is correct
const userHandler = require("./routes/userRoutes");
// Config
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: "backend/config/.env",
  });
}

// Middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(userHandler);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use("/", express.static("uploads"));

// Import routes
const userRoutes = require("./routes/userRoutes");
const shopRoutes = require("./controller/Shop");
const productRoutes = require("./controller/product");
const eventRoutes = require("./controller/events");
const couponCodeRoutes = require("./routes/couponCodeRoutes");
const paymentRoutes = require("./controller/paymentController");
const order = require("./controller/orderController");
const conversation = require("./controller/conversationController");
const message = require("./controller/messageController");

// app.use("/api/v2/user", userRoutes); // Adjusted the route prefix
app.get("/", (req, res) => {
  res.status(200).send('Hello World')
})
app.use("/api/users", userRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/products", productRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/coupon", couponCodeRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", order)
app.use("/api/conversation", conversation)
app.use("/api/messages", message)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging (you can remove this in production)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


module.exports = app;
