const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  deleteUser,
  updateUser,
  forgotPassword,
  resetPassword,
  changePassword,
  getUsers,
  loginStatus,
  sendVerificationEmail,
  updateAddress,
} = require("../controller/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getUser", protect, getUser);
router.delete("/:id", protect, deleteUser);

router.patch("/updateUser", protect, updateUser);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:resetToken", resetPassword);
router.put("/changePassword", protect, changePassword);
router.get("/getUsers", protect, getUsers);


router.get("/loginStatus", loginStatus);
router.post("/sendVerificationEmail", protect, sendVerificationEmail);
router.patch("/updateUserAddress", protect, updateAddress);

module.exports = router;
