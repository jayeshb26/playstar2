const Ticket = require("../models/Ticket")
const User = require("../models/User");
const GameDetails = require("../models/GameDetails");
const PointLogList = require("../models/PointLogList");
const Resultmodel = require("../models/results");
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
        let claim=true;
     
 console.log(claim);
       console.log(ticketData.RetailerID);
       td= new Date(td);
       console.log(td);
       const startDate = new Date(td);
     let   month = '' + (startDate.getMonth() + 1);
       let day = '' + startDate.getDate();
       let year = startDate.getFullYear();
       if (month.length < 2) 
         month = '0' + month;
     if (day.length < 2) 
         day = '0' + day;
       startDate.setHours(0, 0, 0, 0); // Set to the start of the day
       const startString =year+"-"+month+"-"+day+" 00:00:00 " ;//startDate.toISOString().slice(0, 19).replace('T', ' ');
       const endDate = new Date(td);
       endDate.setHours(23, 59, 59, 999); // Set to the end of the day
       const endString =year+"-"+month+"-"+day+" 23:59:59 "; //endDate.toISOString().slice(0, 19).replace('T', ' ');
       console.log(startString);
       console.log(endString);
       let dt;
       if(unclaim=="True")
        {
          claim=false;
         dt =await  Ticket.find({DrawTime:  {
            $gte: startString,
            $lte: endString
          },RetailerID: ticketData.RetailerID,claim:claim });
        }else{
         dt =await  Ticket.find({DrawTime:  {
            $gte: startString,
            $lte: endString
          },RetailerID: ticketData.RetailerID});
        }
       
     console.log(dt);
     //  Date=2024-06-03&UnclaimOnly=True
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
       
       
      
     // let dt =await Ticket.find({"RetailerID": ticketData.RetailerID });
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
        console.log(data);
      res.status(200).json({
        datalist:data,
        Message: "Data received",
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
       console.log(TicketID);
       console.log(ticketData.RetailerID);
       let userDetails = await User.findOne({"ID": ticketData.RetailerID});
       let dt =await Ticket.find({"TicketID": TicketID}).exec();
       let balance = userDetails.Balance;
      //  console.log(dt.length);
      //  console.log(JSON.stringify(dt));
      //  console.log(dt.length);
      //  dt=JSON.stringify(dt);
      //  console.log(dt.length);
      //  dt= JSON.parse(dt);
      //  console.log(dt);
  //  console.log(json(dt));
    console.log(dt.length);
            if(dt.length > 0) {
               console.log(dt.length);
              console.log(dt); 
              console.log(dt[0].claim);               
              if(dt[0].claim==false)
                {
   console.log(dt[0].won);

                userDetails.Balance=userDetails.Balance+dt[0].won;
                userDetails.wonPoint=userDetails.wonPoint+dt[0].won;
                dt.claim=true;
                dt.status=1;
                await User.findOneAndUpdate( {"ID":dt[0].RetailerID}, {
                  $inc: {
                    Balance: dt[0].won,
                    wonPoint: dt[0].won,
                  }, });


                  await Ticket.findOneAndUpdate( {"TicketID":TicketID}, {
                    claim:true,
                    status:1,
                  });
                  

       res.status(200).json({
        RetailerID: ticketData.RetailerID,
        Balance: userDetails.Balance,
        IsClaimed: dt[0].claim,
        GameID: dt[0].GameID,
        PlayAmt: dt[0].TotalAmount,
        ClaimAmt: dt[0].won,
        DrawTime: dt[0].DrawTime,
        DrawName: dt[0].GameName,
        IsCancelled: false,
        CancelTime: null,
        ClaimTime: null,
        TicketID: TicketID,
         Message: "Data received",
         Status: true,
         ID: 0
       });
                }else{

                

       res.status(200).json({
        RetailerID: ticketData.RetailerID,
        Balance: userDetails.Balance,
        IsClaimed: null,
        GameID: null,
        PlayAmt:null,
        ClaimAmt: null,
        DrawTime: null,
        DrawName: null,
        IsCancelled: false,
        CancelTime: null,
        ClaimTime: null,
        TicketID: TicketID,
         Message: "Already claimed",
         Status: true,
         ID: 0
       });
      }

      }
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
        Balance: userDetails.Balance,
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
   let multiplyer = 11;
       multiplyer = 11;
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
 console.log("Ticket DATA  CURRENT BET :  game ud "+req+"ticket data"+dt+"daata"+dt.length);
    if(dt.length>0) {     
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
      let result = Math.floor(Math.random() * 10) + 1;
      let resultx =1; //Math.round(Math.random() * 10)+1;
     
      ress.result=result;
        if(resultx==1)
          {
            ress.x="N";
          }else{
            ress.x= resultx+"X";
          }
    
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
  td= new Date(td);
       console.log(td);
       const startDate = new Date(td);
     let   month = '' + (startDate.getMonth() + 1);
       let day = '' + startDate.getDate();
       let year = startDate.getFullYear();
      
       startDate.setHours(0, 0, 0, 0); // Set to the start of the day
      // const startString =year+"-"+month+"-"+day+" 00:00:00 " ;//startDate.toISOString().slice(0, 19).replace('T', ' ');
       const endDate = new Date(td);
       endDate.setHours(23, 59, 59, 999); // Set to the end of the day
       const endString =year+"-"+month+"-"+day+" 23:59:59 "; //endDate.toISOString().slice(0, 19).replace('T', ' ');
      // console.log(startString);
       console.log(endString);


       const startString =month+"-"+day+"-"+year;
console.log(startString);;
     let dt =await  PointLogList.find({DrDate: startString});
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
  RetailerTicketDetails: async (req, res) => {
    const ticketData = req.body;
    let TicketID=req.query.TicketID;
    let AutoClaim=req.query.AutoClaim;
    //console.log("ticketData: " + TicketID);
   //  console.log(ticketData.RetailerID);
   //  let userDetails = await User.findOne({"ID": ticketData.RetailerID});
     let dt =await Ticket.findOne({TicketID: TicketID});
  //console.log(dt.Details);

       
     res.status(201).json({
     
      datalist:dt.Details,
       Message: "Data received",
       Status: true,
       ID: 0
     });
  },
  ResultList: async (req, res) => {
    const ticketData = req.body;
    let ToDate=req.query.ResultDate;
    let AutoClaim=req.query.AutoClaim;
    //console.log("ticketData: " + TicketID);
   //  console.log(ticketData.RetailerID);
   //  let userDetails = await User.findOne({"ID": ticketData.RetailerID});
    // let dt =await Ticket.findOne({TicketID: TicketID});

    let td= new Date(ToDate);
    console.log(td);
    const startDate = new Date(ToDate);
  let   month = '' + (startDate.getMonth() + 1);
    let day = '' + startDate.getDate();
    let year = startDate.getFullYear();
    if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;
    startDate.setHours(0, 0, 0, 0); // Set to the start of the day
    const startString =year+"-"+month+"-"+day+" 00:00:00 " ;//startDate.toISOString().slice(0, 19).replace('T', ' ');
    const endDate = new Date(ToDate);
    endDate.setHours(23, 59, 59, 999); // Set to the end of the day
    const endString =year+"-"+month+"-"+day+" 23:59:59 "; //endDate.toISOString().slice(0, 19).replace('T', ' ');
    console.log(startString);
    console.log(endString);

     let dt =await  Resultmodel.find({DrawTime:  {
      $gte: startString,
      $lte: endString
    }});
  console.log(dt);

       
     res.status(201).json({
     
      datalist:dt,
       Message: "Data received",
       Status: true,
       ID: 0
     });
  }

};

  module.exports = TicketController;
