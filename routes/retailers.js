const express = require('express');
const { getWinnerResultsByDate, claimeTicket, getBetHistory, getBetHistoryReport, getOnlineRetailers, getAllBetHistory, getCommission, getCommissionByDate, addComplaint, getReprintData, getDayTickets, getBetHistoryDayWise } = require("../controllers/retailers")
const { protect, authorize } = require("../middleware/auth");
const Bet = require("../models/Bet")
const advancedResults = require("../middleware/advancedResults");
const WinResult = require("../models/WinResult");
const router = express.Router();
router.get("/online", getOnlineRetailers);
//use middleware to protect, authorize
router.use(protect);



router.use(authorize("retailer"));
// router.route("/addCreditPoint").post(addDistributerCreditPoint);
// router.route("/reduceCreditPoint").post(reduceDistributerCreditPoint);
// router.route("/distributers").get(getDistributers);
// router.route("/retailers").get(getRetailers);
router.route("/betHistory/").get(advancedResults(Bet), getAllBetHistory)
router.get("/betHistory/:retailerId", getBetHistory)
router.get("/betDayHistory", getBetHistoryDayWise)
router.route("/reprint/:ticketId").get(getReprintData);
router.route("/tickets").get(getDayTickets);
router.route("/winResult").get(advancedResults(WinResult), getWinnerResultsByDate);
router.route("/betHistoryReports").get(advancedResults(Bet), getBetHistoryReport);
router.route("/claim").put(claimeTicket);
router.route("/complaint").post(addComplaint);
router.route("/commission").get(getCommission);
router.route("/commissionByDate").get(getCommissionByDate);
module.exports = router;