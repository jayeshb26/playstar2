const Ticket = require("../models/Ticket")
const User = require("../models/User");
const GameDetails = require("../models/GameDetails")

const TicketController = {
    postTicket: async (req, res) => {
      try {
        const ticketData = req.body;
        const GameTypeID = req.body.GameTypeID;
        console.log('GameID: ', GameTypeID);
        let gameDetails = await GameDetails.findOne({"GameTypeID":GameTypeID});
        console.log(gameDetails);
        ticketData.DrawTime=gameDetails.DrawTime;
        ticketData.GameID=gameDetails.GameID;
       console.log(ticketData);
         let userDetails = await User.findOne({"ID": ticketData.RetailerID});

            console.log(userDetails.Balance);
            //let balance = userDetails.Balance;4
            let newTicket;
            ticketData.GameName=gameDetails.GameName,
            ticketData.startpoint=userDetails.Balance;
            ticketData.endpoint=parseFloat(userDetails.Balance.toFixed(3).padStart(6, '0'))+0.001-parseFloat(req.body.TotalAmount.toFixed(2));
              console.log(ticketData.Balance);
               newTicket = await Ticket.create(ticketData);
        await User.findOneAndUpdate({"ID":ticketData.RetailerID}, {
        $inc: {
          Balance: -req.body.TotalAmount,
          playPoint: req.body.TotalAmount,
         // commissionPoint: distributorCommission,
        },
        lastBetAmount: req.body.TotalAmount,
        lastTicketId: newTicket.TicketID,
      });   
            
        console.log(newTicket);
        
        const balance = ticketData.endpoint; 
        const currentTime = new Date();
        const ticketTime = new Date(); 

        res.status(201).json({
            TicketID: newTicket.TicketID,
            Balance:  balance.toFixed(3)*1,
            CurrentTime: newTicket.createDate,
            TicketTime:  newTicket.createDate,
            GameID: newTicket.GameID,
            GameIDLists: newTicket.GameIDLists,
            TicketIDList:newTicket.GameIDLists,
           
            Message: "Bet Accepted.",
            Status: true,
            ID: 0
        });

      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      }
    },
   // http://glxapi.playlucky.net/api/Client/?Date=2024-05-29&UnclaimOnly=True
    RetailerTicketList: async (req, res) => {
      const ticketData = req.body;
      let td=req.query.Date;
      let unclaim=req.query.UnclaimOnly;
       console.log(ticketData.RetailerID);
       
	// 	"TicketID": 4579974,
	// 	"GameID": 9463412,
	// 	"SalePoint": 120.00,
	// 	"ClaimPoint": 0.00,
	// 	"WinPoint": 0.00,
	// 	"Result": "",
	// 	"JackpotMultiply": "N",
	// 	"TicketTime": "2024-05-29T01:32:44.243",
	// 	"DrawTime": "2024-05-29T01:35:00",
	// 	"GameName": "Lucky Horse Race"
	// },
       
       
      
      let dt =await Ticket.find({"RetailerID": ticketData.RetailerID });
      let data = [];
      let x = [];
      let sdt={}
  let cnt=0;
      for (let res of dt) {
       console.log(data);
       sdt.TicketID=res.TicketID;
        sdt.GameID=res.GameID;
        sdt.SalePoint=res.TotalAmount;
        sdt.ClaimPoint=res.won;
        sdt.WinPoint=res.won;
        sdt.Result=res.winPosition;
        sdt.JackpotMultiply=res.x;
        sdt.TicketTime=res.DrawTime;
        sdt.DrawTime=res.DrawTime;
        sdt.GameName=res.GameName;
        
        console.log(cnt);
        cnt++;
       data.push(sdt);
       console.log(data);
       sdt={};
      }
      
      res.status(201).json({
        datalist:data,
        Message: "Bet Accepted.",
        Status: true,
        ID: 0
      });
    }

  };

  module.exports = TicketController;
