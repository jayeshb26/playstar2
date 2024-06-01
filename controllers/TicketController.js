const Ticket = require("../models/Ticket")
const User = require("../models/User");
const GameDetails = require("../models/GameDetails");
const PointLogList = require("../models/PointLogList");
const immutable = require("object-path-immutable");

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
    },
    getGameBetDetail: async (req, res) => {
      
      console.log(req);
     // req=929142;
       //let userDetails = await User.findOne({"ID": ticketData.RetailerID});
       let data = [];
       let x = [];
       let sdt={}
       
   let cnt=0;
   let cntsale=0;
   let cntwin=0;
   let cntclaim=0;
   let cntend=0;
   let multiplyer = 10;
       multiplyer = 10;
       let gposition={};
       let gtransactions={};
       function  resultcallback(position,tcid)
       {
     for (let pos in position) {
       gposition = immutable.update(gposition, [pos], (v) =>
         v ? v + position[pos] * multiplyer : position[pos] * multiplyer
       );
       gtransactions = immutable.update(gtransactions, [pos, tcid], (v) =>
         v ? v + position[pos] * multiplyer : position[pos] * multiplyer
       );
     }
    }

    //  console.log( games[gameName].position);
    //  console.log( transactions[gameName]);
 let tempPos={};
 let dt =await Ticket.find({GameID: req});
    if(dt.length > 0) {     
 for (let res of dt) {
      //  console.log(res.Details);
           for(let i=0; i<res.Details.length;i++)
            {
              //console.log(res.Details[i].Item);
              //console.log(res.Details[i].Point);
                tempPos[res.Details[i].Item]=res.Details[i].Point;
            }
        sdt.TicketID=res.TicketID;
         sdt.GameID=res.GameID;
         sdt.cntsale=cntsale+res.TotalAmount;
         sdt.cntclaim=cntclaim+res.won;
         sdt.cntwin=cntclaim+res.won;
         console.log("ssstc",res.TicketID);
         console.log(tempPos);
         resultcallback(tempPos,res.TicketID);
    
       }
       let result = Math.floor(Math.random() * 10) + 1;
       console.log("===game================================ ",result);
      
    console.log(gposition);
    console.log(gtransactions[result]);
    for (const transId in gtransactions[result]) {
         gtransactions[result][transId] =
          gtransactions[result][transId] * 1;
  //        console.log(transId);
         }
         console.log(gtransactions[result]);
    for (const transId in gtransactions[result]) {
    console.log(transId);
    console.log("Result Price is :", gtransactions[result][transId]);
   
    let tcaa= await Ticket.findOne({TicketID:transId});
if(tcaa.AutoClaim){
    await Ticket.findOne({TicketID:transId},function (err, product) {
   //   product.category = fields.category ? fields.category[0] : product.category;
   
    //  if(product.AutoClaim===true)x x = product.AutoClaim
      //  {
          product.claim=true;
          product.winPosition= result;
      product.won=gtransactions[result][transId];
      console.log("Product", product.RetailerID);
      product.save(function (err) {
          if(err) {
              console.error('ERROR!');
          }
      });
  },{ new: true }).then(firstDoc => {
    if (!firstDoc) {
      throw new Error('First document not found.');
    }
  console.log("first doc",firstDoc.RetailerID);
  return Promise.all([firstDoc,User.findOneAndUpdate(
    {"ID":firstDoc.RetailerID},
    {
              $inc: {
                 Balance:  gtransactions[result][transId],
                wonPoint:  gtransactions[result][transId],
               },},
    { new: true } // To get the updated document as a result
  )]);
})
.then(([firstDoc, secondDoc]) => {
  if (!secondDoc) {
    throw new Error('Second document not found.');
  }
  console.log('Second document updated:', secondDoc.ID);
  console.log('Second document updated:', secondDoc.Balance);
  console.log("first doc",firstDoc.RetailerID);
           
      let pointl={}
      pointl.GameID=  firstDoc.GameID,
      pointl.RetailerID=firstDoc.RetailerID;
      pointl.TicketID=firstDoc.TicketID;
      pointl.UserCode=secondDoc.Code;
      pointl.GameName=  firstDoc.GameID;
      pointl.PrevBal=secondDoc.Balance;
      pointl.AddPoint=gtransactions[result][transId];
      pointl.MinusPoint=0.0;
      pointl.NewBal= Number( secondDoc.Balance+gtransactions[result][transId]);
      pointl.DnT=firstDoc.DrawTime;
      pointl.TicketAdjType="AUto Claim"; 
        console.log(pointl);
         PointLogList.create(pointl)
})
.catch(error => {
  console.error('Error:', error);
});
}else{
 // product.claim=true;
 tcaa.winPosition= result;
 tcaa.won=gtransactions[result][transId];
console.log("Product falssssssssss", tcaa.RetailerID);
tcaa.save(function (err) {
  if(err) {
      console.error('ERROR!');
  }
}  );
}
    }
    let ress={};
    ress.result=result;
    ress.x="N";
    return ress;
  
    }else{
      let ress={};
      let result = Math.round(Math.random() * 9);
      let resultx = Math.round(Math.random() * 9);
     
      ress.result=result;
     
      ress.x="N";
      return ress;
       
    }
  } ,
  PointLogList :async (req, res) => {
    const ticketData = req.body;
    let ToDate=req.query.Date;
   // let FromDate=req.query.FromDate;
     console.log(ticketData.RetailerID);
     //let fd=new Date(FromDate);
    let td= new Date(ToDate);
    console.log(td);
     let dt =await  PointLogList.find({DrDate: td});
  console.log(dt);
     let data = [];
     let x = [];
     let sdt={}

 let cnt=0;
 let cntsale=0;
 let cntwin=0;
 let cntclaim=0;
 let cntend=0;

  //    for (let res of dt) {
  //     console.log(dt);
  //     sdt.TicketID=res.TicketID;
  //      sdt.GameID=res.GameID;
  //      cntsale=cntsale+res.TotalAmount;
  //      cntclaim=cntclaim+res.won;
  //      cntwin=cntclaim+res.won;
  
  //    }
  //    sdt.Date= new Date();
  //    sdt.SalePoint= cntsale,
  //    sdt.WinPoint= cntwin,
  //    sdt.ClaimPoint= cntclaim,
  //    sdt.EndsPoint= cntsale,
  //    sdt.Commi= 0.0,
  //    sdt.NTP= cntsale-cntwin,
  //    sdt.ClaimCommi= 0.0,
  //    sdt.BONUS= 0.0
  // data.push(sdt);
     
     res.status(201).json({
       datalist:dt,
       Message: "Data received",
       Status: true,
       ID: 0
     });
  },

};

  module.exports = TicketController;
