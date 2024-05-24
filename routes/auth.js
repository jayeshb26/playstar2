const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
  // forgotPassword,
  // resetPassword,
  updateDetails,
  updatePassword,
  updateTransactionPin,
  loginRetailer,
  getTransactions,
  logoutRetailer,
  getUserName,
  getUser
} = require("../controllers/auth");
const { protect, authorize } = require("../middleware/auth");
const User = require("../models/User"); 

const router = express.Router();
// router.post("/", register);
router.post("/login", login);
router.post("/retailer/login", loginRetailer);
router.get("/logout", logout);
router.get("/retailerLogout/:id", logoutRetailer);
router.get("/transactions", protect, getTransactions);
router.route("/user/:id").get(getUser)
router.route("/me").get(protect, getMe);
router.put("updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);
router.put("/updateTransactionPin", protect, updateTransactionPin);
router.get("/userName", protect, getUserName);
router.get("/contactus", async function (req, res, next) {
  try {
    
    const userId = "61d7bcd1153a05cf20cfc6f2";

    // Fetch the user by ID from the database
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Send the waLink as a response
    res.status(200).json({
      success: true,
      data: {
        msg: user.waLink,
      },
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});






module.exports = router;