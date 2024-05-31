const Ticket = require("../models/Ticket")
const User = require("../models/User");
const GameDetails = require("../models/GameDetails");
const PointLogList = require("../models/PointLogList");

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
            
      let pointl={}
      pointl.GameID=  ticketData.GameID,
      pointl.RetailerID=ticketData.RetailerID;
      pointl.TicketID=newTicket.TicketID;
      pointl.UserCode=userDetails.Balance;
      pointl.GameName=  ticketData.GameName;
      pointl.PrevBal=userDetails.Balance;
      pointl.AddPoint=0.0;
      pointl.MinusPoint=req.body.TotalAmount.toFixed(2);
      pointl.NewBal= ticketData.endpoint;
      pointl.DnT=ticketData.DrawTime;
      pointl.TicketAdjType="Ticket Bet"; 
        console.log(pointl);
         await PointLogList.create(pointl);
        
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
    },
    RetailerSaleReport: async (req, res) => {
      const ticketData = req.body;
      let ToDate=req.query.ToDate;
      let FromDate=req.query.FromDate;
       console.log(ticketData.RetailerID);
       let fd=new Date(FromDate);
      let td= new Date(ToDate);
      console.log(td,fd);
       let dt =await Ticket.find({DrDate: {
        $gte: FromDate ,
        $lt:ToDate   
    }});
    console.log(dt);
       let data = [];
       let x = [];
       let sdt={}
   let cnt=0;
   let cntsale=0;
   let cntwin=0;
   let cntclaim=0;
   let cntend=0;

       for (let res of dt) {
        console.log(dt);
        sdt.TicketID=res.TicketID;
         sdt.GameID=res.GameID;
         cntsale=cntsale+res.TotalAmount;
         cntclaim=cntclaim+res.won;
         cntwin=cntclaim+res.won;
    
       }
       sdt.Date= new Date();
       sdt.SalePoint= cntsale,
       sdt.WinPoint= cntwin,
       sdt.ClaimPoint= cntclaim,
       sdt.EndsPoint= cntsale,
       sdt.Commi= 0.0,
       sdt.NTP= cntsale-cntwin,
       sdt.ClaimCommi= 0.0,
       sdt.BONUS= 0.0
    data.push(sdt);
       
       res.status(201).json({
         datalist:data,
         Message: "Data received",
         Status: true,
         ID: 0
       });
    },
    TicketClaim: async (req, res) => {
      const ticketData = req.body;
      let TicketID=req.query.TicketID;
      let AutoClaim=req.query.AutoClaim;
      
       console.log(ticketData.RetailerID);
       let userDetails = await User.findOne({"ID": ticketData.RetailerID});
       let dt =await Ticket.find({TicketID: TicketID});
    console.log(dt.status);

         
       res.status(201).json({
        RetailerID: ticketData.RetailerID,
        Balance: userDetails.balance,
        IsClaimed: dt.claim,
        GameID: dt.GameID,
        PlayAmt: dt.TotalAmount,
        ClaimAmt: dt.won,
        DrawTime: dt.DrawTime,
        DrawName: dt.GameName,
        IsCancelled: false,
        CancelTime: null,
        ClaimTime: null,
        TicketID: TicketID,
         Message: "Data received",
         Status: true,
         ID: 0
       });
    },
    TicketClaimAll: async (req, res) => {
      const ticketData = req.body;
      let TicketID=req.query.TicketID;
      let AutoClaim=req.query.AutoClaim;
      
       console.log(ticketData.RetailerID);
       let userDetails = await User.findOne({"ID": ticketData.RetailerID});
       let dt =await Ticket.find({TicketID: TicketID});
    console.log(dt.status);

         
       res.status(201).json({
        RetailerID: ticketData.RetailerID,
        Balance: userDetails.balance,
        IsClaimed: false,
        GameID:0,
        PlayAmt:0.0,
        ClaimAmt: 0.0,
        DrawTime: null,
        DrawName: null,
        IsCancelled: false,
        CancelTime: null,
        ClaimTime: null,
        TicketID:0,
        Message: "No un-claim ticket available.",

         Status: true,
         ID: 0
       });
    }
  };

  module.exports = TicketController;
