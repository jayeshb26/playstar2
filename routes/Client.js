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
  getUser,
  UpdateCheck,
  authTokenHit
} = require("../controllers/auth");

const clientController = require('../controllers/VersionController');
//const clientValidator = require('../validators/clientValidator');
const User = require('../models/User');
const UserController = require('../controllers/UserController');
const gameDetailsController = require('../controllers/GameController');
//const authenticate = require('..//middleware/authMiddleware');
//const AuthController = require('../controllers/AuthController');
const ResultController = require('../controllers/ResultController');
//const validateTicketPost  = require('../validators/clientValidator');
const TicketController  = require('../controllers/TicketController');
const { protect, authorize } = require("../middleware/auth");
//const User = require("../models/User"); 

const router = express.Router();
// router.post("/", register);
router.post("/login", login);
router.post("/retailer/login", loginRetailer);
//router.get("/logout", logout);
router.get("/retailerLogout/:id", logoutRetailer);
router.get("/transactions", protect, getTransactions);
router.route("/user/:id").get(getUser)
router.route("/me").get(protect, getMe);
router.put("updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);
router.put("/updateTransactionPin", protect, updateTransactionPin);
router.get("/userName", protect, getUserName);



router.get('/UpdateCheck',UpdateCheck);
 router.post('/RetailerLogin', UserController.retailerLogin);
 router.get('/RetailerSettUpdate', UserController.RetailerSettUpdate);
 
 router.get('/RetailerGameList', gameDetailsController.getGameList);
router.get('/GetGameDetailsNew', gameDetailsController.getGameDetails);
 router.get('/GetResult',  ResultController.getResult);
 router.get('/AuthTokenHit', authTokenHit);
 router.post('/TicketPost', TicketController.postTicket);
 router.get('/RetailerTicketList', TicketController.RetailerTicketList);
 router.get('/RetailerSaleReport', TicketController.RetailerSaleReport);
 router.get('/TicketClaim', TicketController.TicketClaim);
 router.get('/TicketClaimAll', TicketController.TicketClaimAll);
 router.get('/PointLogList', TicketController.PointLogList);
 router.get('/RetailerTicketDetails', TicketController.RetailerTicketDetails);

router.get('/RetailerLogout', UserController.logout);
//RetailerSettUpdate
// router.get("/contactus", async function (req, res, next) {
//   try {
    
//     const userId = "61d7bcd1153a05cf20cfc6f2";

//     // Fetch the user by ID from the database
//     const user = await User.findOne({ _id: userId });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: "User not found",
//       });
//     }

//     // Send the waLink as a response
//     res.status(200).json({
//       success: true,
//       data: {
//         msg: user.waLink,
//       },
//     });
//   } catch (error) {
//     // Handle errors
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       error: "Internal Server Error",
//     });
//   }
// });






module.exports = router;