const { json } = require("body-parser");
const Result = require("../models/results");
const jwt = require("jsonwebtoken");
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const ResultController = {
  getResult: async (req, res) => {
    try {
      const result = await Result.findOne({ "gameID":req.body.GameID });
          let userDetails = await User.findOne({"ID":req.body.RetailerID});
          let TicketDetais = await Ticket.findOne({"RetailerID":req.body.RetailerID, "GameID":req.body.GameID});
            console.log(userDetails.Balance);
            let balance = userDetails.Balance;
     console.log(JSON.stringify(result));
      let dd=JSON.stringify(result);
     dd= JSON.parse(dd);
     console.log(dd);
     let d1=new Date();
                d1.setHours(d1.getHours() + 5);
                d1.setMinutes(d1.getMinutes() + 30);
               dd.CurrentTime= d1.toISOString();
             
               dd.Balance=balance;
               dd.WinPoint=0.0;
               let rr={};
 if(TicketDetais.won)
  {
    dd.WinPoint=TicketDetais.won;
  }
               rr.Balance=balance;
               rr.Result=dd.Result;
               rr.JackpotMultiply=dd.JackpotMultiply;
               rr.NextGameID=dd.NextGameID;
               rr.NextDrawTime=dd.DrawTime;
               rr.WinPoint=dd.WinPoint;
               rr.CurrentTime=d1.toISOString();
               rr.GameID=dd.gameID;
               rr.ID=0;
               rr.Status=true;
        

               rr.Message=  "Result received.";
      if (!result) {
        return res.status(404).json({ message: "Result not found" });
      }

      res.json(rr);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

module.exports = ResultController;
