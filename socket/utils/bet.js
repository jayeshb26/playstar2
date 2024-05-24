const User = require("../../models/User");
const Bet = require("../../models/Bet");
const WinResult = require("../../models/WinResult");
const Winning = require("../../models/Winning");
const Admin = require("../../models/Admin");

async function placeBet(retailerId, position, betPoint, ticketId, gameName) {
  //Verify
 try {
    
      
    let user = await User.findById(retailerId);
    console.log(user);
     console.log("This is referralId Data : ",user.commissionPercentage);
    let retailerCommission = user.commissionPercentage * betPoint / 100;
    console.log(user.referralId);
    const retailer = await User.findById(user.referralId);
    console.log(retailer);
    console.log("This is referralId Data : ",retailer.commissionPercentage);
    let distributorCommission = retailer.commissionPercentage * betPoint / 100;
    console.log(retailer);
    const distribuor = await User.findById(retailer.referralId);
    console.log(distribuor);
    console.log("This is referralId Data : ",retailer.commissionPercentage);
    let superdistributorCommission = distribuor.commissionPercentage * betPoint / 100;


//const agent = await User.findById(premium.referralId);
console.log("*******************************************");
console.log("Player : ", user);
console.log("classic : ", retailer);
console.log("executive : ", distribuor);
//console.log("premium : ", superdistribuor);
//console.log("agent : ", agent);
console.log("*******************************************");

    if (user.creditPoint >= betPoint) {
      let bet = await Bet.create({
        retailerId,
        bet: betPoint,
        startPoint: user.creditPoint,
        userName: user.userName,
        position,
        name: user.name,
        ticketId,
        endPoint: user.creditPoint,
        // userCommission,
        retailerCommission,
        distributorCommission,
        superdistributorCommission,
        gameName
      });
      await User.findByIdAndUpdate(retailerId, {
        $inc: {
          creditPoint: -betPoint,
          playPoint: betPoint,
          commissionPoint: distributorCommission,
        },
        lastBetAmount: betPoint,
        lastTicketId: ticketId,
      });
      await User.findByIdAndUpdate(user.referralId, {
        $inc: {
          commissionPoint:distributorCommission ,
        },
      });
      await User.findByIdAndUpdate(retailer.referralId, {
        $inc: {
          commissionPoint:superdistributorCommission ,
        },
      });

      return bet._id;
    }
    return 0;
  } catch (err) {
    console.log("Error on place bet", err.message);
    return;
  }
}



async function updatebalnce(oldbalance, newbalance) {
  //Verify
 try {
    
      
   


//const agent = await User.findById(premium.referralId);
console.log("*******************************************");
console.log("OLd balance : ", oldbalance);
console.log("NEw BAlance : ", newbalance);

//console.log("premium : ", superdistribuor);
//console.log("agent : ", agent);
console.log("*******************************************");

   
      let bet = await Admin.create({
      
        lastbalance: oldbalance,
        newbalance: newbalance,
       
      });
    
  } catch (err) {
    console.log("Error on place bet", err.message);
    return;
  }
}
async function getAdminData(gameName) {
  let data = await Bet.aggregate([
    {
      $match: {
        gameName,
        DrDate: () =>
          new Date()
            .toLocaleString("en-US", {
              timeZone: "Asia/Calcutta",
            })
            .toString()
            .split(",")[0]
            .replace(/\//g, (x) => "-"),
      },
    },
    { $group: { _id: "$DrDate", totalCollection: { $sum: "$bet" }, totalPayment: { $sum: "$won" } } }

  ]);
  return data;
}
async function winGamePay(price, betId, winPosition) {
  try {
    console.log(
      "WInGame Pay: price : ",
      price,
      "  betId : ",
      betId,
      " winPosition : ",
      winPosition
    );

    const betData = await Bet.findByIdAndUpdate(betId, {
      $inc: { won: price, endPoint: price },
    });
    let user = "";
    user = await User.findByIdAndUpdate(betData.retailerId, {
      $inc: { creditPoint: price, wonPoint: price },
    });

    return betData.retailerId;
  } catch (err) {
    console.log("Error on winGamePay", err.message);
    return err.message;
  }
}

//Add result of the Game
async function addGameResult(result, x, isWinByAdmin, gameName,adminBalance) {
  try {
    await WinResult.create({ result, x, isWinByAdmin, gameName,adminbalnce: adminBalance });
    await Bet.updateMany({ winPosition: "", gameName }, { winPosition: result, x: x });
  } catch (err) {
    console.log("Error on addGameResult", err.message);
    return err.message;
  }
}

//Add result of the Game
async function getLastrecord(gameName) {
  try {
    let result = await WinResult.find({ gameName })
      .select({ result: 1, x: 1, _id: 0 })
      .sort("-createdAt")
      .limit(15);
    let data = [];
    let x = [];

    for (let res of result) {
      data.push(res.result);
      x.push(res.x);
    }

    return { records: data, x };
  } catch (err) {
    console.log("Error on getLastrecord", err.message);
    return err.message;
  }
}

//Get Admin Percentage for winning Result
async function getAdminPer() {
  return await Winning.findById("602e55e9a494988def7acc25");
}
//Get current running Game Data{
async function getCurrentBetData(retailerId) {
  let data = await Bet.find({ winPosition: "", retailerId });
  return data;
}

module.exports = {
  placeBet,
  winGamePay,
  getAdminPer,
  addGameResult,
  getLastrecord,
  getCurrentBetData,
  getAdminData,
  updatebalnce
};
