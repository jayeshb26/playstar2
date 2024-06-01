const { io } = require("../server");
const { getUserInfoBytoken, getUserInfo, logOutUser } = require("./utils/users");
const { getGameBetDetail } = require("../controllers/TicketController");
const {
  placeBet,
  winGamePay,
  getAdminPer,
  addGameResult,
  getLastrecord,
  getAdminData,
  updatebalnce,
  getGameDetail,
  updateGameDetail,

} = require("./utils/bet");

const immutable = require("object-path-immutable");
var _ = require("lodash");
const { customAlphabet } = require("nanoid");
const User = require("../models/User");
const { getResult } = require("../controllers/ResultController");
const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 10);
const moment = require('moment-timezone');

let games = {
  hourse: {
    startTime: new Date().getTime() / 1000,
    position: {},
    adminBalance: 0,
  },
  playToWin: {
    startTime: new Date().getTime() / 1000 + 10,
    position: {},
    adminBalance: 0,
  }
};
//console.log("game start : " +  getstartgame(18))
let winnerNumber = { playSmart: 0, playToWin: 0 };
let xcnt = 0;
let x = 1;

let isWinByAdmin =false;// { playSmart: false, playToWin: false };
//users: use for store game Name so when user leave room than we can used
let users = {};
//used for when he won the match
let retailers = {};
//TransactionId
let transactions = {
  playSmart: {},
  playToWin: {}
};
let adminPer = 90;

io.on("connection", (socket) => {
//   //Join Event When Application is Start

//   socket.on("checkLogin", async ({ token }) => {

//     let user = await getUserInfoBytoken(token);
//     console.log("Useris ", user);
//     console.log("userid", user._id)
//     if (user != undefined) {
//       if (retailers[user._id])
//         if (retailers[user._id] != socket.id) {

//           io.to(retailers[user._id]).emit("res", {
//             data: "Some one use your Id to other device",
//             en: "logout",
//             status: 1,
//           });
//         }
//       retailers[user._id] = socket.id;
//     }
//   })

// socket.on("joinAdmin1", async ({ adminId }) => {
//     try {
//       let user = await getUserInfo(adminId);
//       if (user.role == "Admin") {
//         socket.join("adminData");
// console.log("admin ne games moklu balance mate ",games)
//         socket.emit("resAdmin", {
//           data: games,
//         });
// console.log(games.playToWin);
//       } else
//         socket.emit("res", {
//           data: "You are not authorised to access this information",
//           en: "error",
//         });
//     } catch (error) {
//       console.log(error);
//     }
//   });

//   socket.on("changeAdminBalance", async ({ adminId, data }) => {
//     try {
//     //  console.log(adminId, data);
//       let user = await getUserInfo(adminId);
//      // console.log(user);
//       if (user.role == "Admin") {
//      //   games.rouletteTimer40.adminBalance = data.rouletteTimer40;
//      //   games.funroulette.adminBalance = data.funroulette;
//       //  games.funtarget.adminBalance = data.funtarget;
//       let user = await updatebalnce(games.playToWin.adminBalance,data.playToWin);
//         games.playToWin.adminBalance = data.playToWin;
//        // games.animal.ad = data.animal;
      
//           console.log("data change", games.playToWin.adminBalance);
//         socket.emit("resAdmin", {
//           data: games,
//         });
//       } else
//         socket.emit("res", {
//           data: "You are not authorised to access this information",
//           en: "error",
//         });
//     } catch (error) {
//       console.log(error);
//     }
//   });
//   socket.on("join", async ({ token, gameName }) => {
//     try {
//       let user = await getUserInfoBytoken(token);
//       console.log("vvivjjjjjjjjjjjjjjjjjijv", token, gameName);
//       //Log Out other User
//       retailers[user._id] = socket.id;
//       let numbers = await getLastrecord(gameName);
//       console.log("vvivjjjjjjjjjj", gameName, numbers);
//       users[socket.id] = gameName;
//       retailers[user._id] = socket.id;
//       socket.join(gameName);
//       // let gameData = await getCurrentBetData( user._id)
//       socket.emit("res", {
//         data: {
//           user,
//           time: new Date().getTime() / 1000 - games[gameName].startTime,
//           numbers: numbers.records,
//           x: numbers.x,
//           gameName
//         },
//         en: "join",
//         status: 1,
//       });
//     } catch (error) {
//       console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
//       console.log(error);
//       console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
//     }

//   });

//   socket.on("joinAdmin", async ({ adminId, gameName }) => {
//    try{
//     let dataAdmin = await getAdminData(gameName);

//     let numbers = await getLastrecord(gameName);
//     let user = await getUserInfo(adminId);
//     if (user.role == "Admin") {
//       socket.join("adminData" + gameName);
//       console.log("ldoooooooooooooooooooooooo", gameName, games[gameName]);
//       socket.emit("resAdmin", {
//         data: games[gameName].position,
//         numbers: numbers.records.splice(0, 5),
//         gameName,
//         x: numbers.x.splice(0, 5),
//         time: new Date().getTime() / 1000 - games[gameName].startTime,
//         dataAdmin,
//       });
//     } else{
//       socket.emit("res", {
//         data: "You are not authorised to access this information",
//         en: "error",
//       });
//     }

//     } catch (error) {
//       console.log(error);
//     }
//   });

//   socket.on("winByAdmin", ({ cardNumber, y, gameName }) => {

//     if (cardNumber != undefined) {
//       winnerNumber[gameName] = cardNumber;
//       x = y;
//       isWinByAdmin = true;
//     }
//     console.log( cardNumber);
//     console.log( y);
//     console.log(winnerNumber);
//   });

//   socket.on("placeBet", async ({ retailerId, position, betPoint, gameName }) => {
//     console.log("GameName :", gameName, position);
//     let ticketId = nanoid();
//     betPoint = 0;
//     for (let pos in position) {
//       betPoint += position[pos];
//     }
//     console.log("bet Point", betPoint)
//     const result = await placeBet(retailerId, position, betPoint, ticketId, gameName);

//     if (result != 0) {
//       playGame(position, result, gameName);

      
//       if (betPoint){ 
//         let gamemodedata= await getAdminPer();
//         console.log("bettime admin percent",gamemodedata.percent);
//           console.log("bettime adminba;cne",games[gameName].adminBalance);      
//         console.log("bettime adminba;cne",adminPer);
//           games[gameName].adminBalance += (betPoint * gamemodedata.percent) / 100;
//       }
//       console.log("bettime after adminba;cne",games[gameName].adminBalance);
//       let dataAdmin = await getAdminData(gameName);
//       console.log("Vijay Lodu Ne AApyo ", games[gameName].position)
//       socket
//         .to("adminData" + gameName)
//         .emit("resAdminBetData", { data: games[gameName].position, gameName, dataAdmin });

//     }

//     socket.emit("res", {
//       data: {
//         ticketId,
//         gameName,
//         result:
//           result == 0
//             ? "You don't have sufficient Balance or Error on Place bet"
//             : "Place Bet Success",
//       },
//       en: "placeBet",
//       status: 1,
//     });
//   });

//   socket.on("leaveRoom", async ({ userId, gameName }) => {
//     console.log("leaveRoom calllll================================================================");
//     socket.leave(gameName);
//     console.log("vjdvjvjf leave logout calll ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||", userId);
//     await logOutUser(userId);
//     delete users[socket.id];

//     delete retailers[userId];
//   });

//   //Disconnect the users
//   socket.on("disconnect", async () => {

//     console.log("disconnect calllll================================================================");
//     console.log("Users Data:", users);
//     console.log("RetailersData", retailers);
//     if (users[socket.id]) {

//       console.log("disconnect leave calllll================================================================");
//       socket.leave(users[socket.id]);
//       delete users[socket.id];
//       for (const userId in retailers) {
//         if (retailers[userId] == socket.id) {
//           delete retailers[userId];

//           console.log("vjdvjvjf disconnect logout calll ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||", userId);
//           await logOutUser(userId);
//         }
//       }
//     }
//   });

//   socket.on("beep", () => {
//     socket.emit("boop", {
//       data: {},
//       status: 1,
//     });
//   });
});

let firstc=0;
let gamedrtime;
//let DrawT= getstartgame(18);
console.log("gAME TIME:",moment().tz("Asia/Calcutta").format('YYYY-MM-DD HH:mm:ss'));
//console.log(DrawT);
 console.log("gAME TIME:",moment().tz("Asia/Calcutta").format('YYYY-MM-DD HH:mm:ss'));
setInterval(async () => {
  // if (new Date().getHours() > 7 && new Date().getHours() < 22) {
//   if (new Date().getTime() / 1000 > games.playSmart.startTime + 95) {
//  //   await getResult(11, "playSmart");
//   }
// console.log(gamed.DrawTime);
if (firstc==0){
  if (new Date().getTime() / 1000 > games.hourse.startTime + 50) {
    gamedrtime=await getstartgame(18);
    console.log("gAME TIME:" ,gamedrtime);
    //await getResult1(9, "playToWin");
  }
}else{
   console.log("dr time",gamedrtime);
  if(moment().tz("Asia/Calcutta").format('YYYY-MM-DD HH:mm:ss')>gamedrtime){
    console.log("======================dr time===============",gamedrtime);
    await getResult1(11, "playSmart");
  }  
}

  //Get Admin Percentage
 
  //}
}, 1000);

getstartgame=async(id)=>{
  let  gamed= await getGameDetail(id);
   firstc=1;
  console.log("game detail",gamed.DrawTime);
  return gamed.DrawTime;
}


getResult1 = async(a,blur)=>{
  let result = Math.round(Math.random() * 9);
  //games["hourse"].startTime = new Date().getTime() / 1000;
  let gamed= await getGameDetail(18);
  console.log("game detail",gamed.DrawTime);
  //console.log("game time span",gamed.TimeSpan)
  let cgid= gamed.GameID;
  let reultb=await getGameBetDetail(cgid);
  result=reultb.result;
  x=reultb.x;
  console.log("FFFFF",await getGameBetDetail(cgid));
     gamed.GameID=gamed.GameID+1;
    
     var ddate = moment( gamed.DrawTime);
    // console.log("game detail",ddate);
      //ddate=ddate.add(5,'h');
      //ddate=ddate.add(30,'m');
      var ctime=gamed.DrawTime;
     
      console.log("game draw time 1===",gamedrtime);
    ddate= ddate.add(gamed.TimeSpan, 's').format("YYYY-MM-DD HH:mm:ss ");
    gamedrtime=ddate;
    console.log("game draw time 2===",gamedrtime);
   
    console.log("game detail2",ddate);
     gamed.DrawTime=ddate;
     console.log("game detail3",gamed);
      await updateGameDetail(gamed);
     // await updateGameDetail(result, x, isWinByAdmin[gameName], gameName,games[gameName].adminBalance);
  await addGameResult(result, 18,x,gamed.GameID,  gamed.DrawTime,ctime,cgid);

}
console.log("result--------------22222222222222222222222221111111111111111 avvvvuuuu",getResult1(11, "playSmart"));

// setInterval(async() => {
//   x['playToWin'] = 1;
//   console.log('x Round', x['playToWin']);
  
//   // Wait for a random duration between 30 and 40 seconds
//   const randomDuration = Math.floor(Math.random() * 660) + 1800;
//   console.log(`Waiting for ${randomDuration} seconds...`);
  
//   // Reset x to 0 after the random duration
//   setTimeout(() => {
//     x['playToWin'] = 1;
//     console.log('Resetting x to 1');
//   }, randomDuration * 1000);
// }, 60 * 1000);

// let rd=Math.floor(Math.random() * 10) + 15;
// getResult = async (stopNum, gameName) => {
// console.log("random number",Math.floor(Math.random() * 10) + 15);
// //Math.floor(Math.random() * 10) + 15;  
// //console.log("x cnt count",xcnt,x[gameName]);

//   console.log("x cnt count",xcnt);
//   let result = "";
// console.log("result pahle admin balance",games[gameName].adminBalance);
//   games[gameName].startTime = new Date().getTime() / 1000;
//   let sortResult;
//   let gamemodedata= await getAdminPer();
//   console.log(gamemodedata);
//   sortResult = sortObject(games[gameName].position);
//   console.log(sortResult);
//   let gamemod = gamemodedata.gameMode;
 

  
// //    if(sortResult.length!=0){
// //     console.log("isWinByAdmin els   sort reuslte",isWinByAdmin);
// //     console.log("result",result);
// //     console.log("x",x[gameName]);
// //     console.log("isWinByAdmin",isWinByAdmin);
// //     console.log("gameName",winnerNumber[gameName]);
   
// //   if (isWinByAdmin !=true) {
// //     console.log("=================================================  JOkeer =================================");
// //     console.log("random number",rd);
// //     console.log("xcnt current :",xcnt);

// //     if(xcnt==rd)
// //     {
// //       x[gameName]=1;
// //       xcnt=0;
// //       rd=Math.floor(Math.random() * 10) + 15;
// //     }else{
// //       x[gameName]=1;
// //       xcnt++;
// //     }

// //     console.log("xcnt current after :",x[gameName]);
// //     console.log("xxx game  :",xcnt);
// //     console.log("random number",rd);
// //         console.log("=================================================  close JOkeer =================================");
    
// //       if(parseInt(gamemodedata.gameMode)==4){
// //         for (const num of sortResult) {
// //           let value = Object.values(num)[0];
// //           let key = Object.keys(num)[0];
// //           if (value < games[gameName].adminBalance) {
// //             if (games[gameName].position[result] != games[gameName].position[key]) {
// //               resultArray = [];
// //             }
// //             resultArray.push(key);
// //             result = resultArray[Math.floor(Math.random() * (resultArray.length-1))];
// //             lowestResult = result;
// //           }
// //           if (value > games[gameName].adminBalance) {
// //             break;
// //           }
// //         }
// //     let counter = 0;
// //     if (games[gameName].position[result])
// //   while (games[gameName].adminBalance < games[gameName].position[result]) {
// //     result = Math.round(Math.random() * stopNum);
// //     counter++;

// //     if (counter == 100) {
// //       //aaya Error mali ti
// //       if (lowestResult != "") result = lowestResult;
// //       else result = Math.round(Math.random() * stopNum);
// //       break;
// //     }
// //   }
// //      if (result == "") {
// //     result = Math.round(Math.random() * stopNum);
// //   }
// //   //  x[gameName] = 1;

    
// //       for (const transId in transactions[gameName][result]) {
// //         transactions[gameName][result][transId] = transactions[gameName][result][transId] * x[gameName];
// //       }
   

// //   }
    

// //       if(parseInt(gamemodedata.gameMode)==3){
// //         for (const num of sortResult) {
// //           let value = Object.values(num)[0];
// //           let key = Object.keys(num)[0];
// //           if (value < games[gameName].adminBalance) {
// //             if (games[gameName].position[result] != games[gameName].position[key]) {
// //               resultArray = [];
// //             }
// //             resultArray.push(key);
// //             result = resultArray[Math.floor(Math.random() * (resultArray.length-1))];
// //             lowestResult = result;
// //           }
// //           if (value > games[gameName].adminBalance) {
// //             break;
// //           }
// //         }
// //     let counter = 0;
// //     if (games[gameName].position[result])
// //   while (games[gameName].adminBalance < games[gameName].position[result]) {
// //     result = Math.round(Math.random() * stopNum);
// //     counter++;

// //     if (counter == 100) {
// //       //aaya Error mali ti
// //       if (lowestResult != "") result = lowestResult;
// //       else result = Math.round(Math.random() * stopNum);
// //       break;
// //     }
// //   }





// //   if (result == "") {
// //     result = Math.round(Math.random() * stopNum);
// //   }
// //       console.log("funtarget high mode result",result);
// //      // if(x[gameName]==2){
// //         console.log("funtarget 2x in ",result);
   
     
// //         for (const transId in transactions[gameName][result]) {
// //           transactions[gameName][result][transId] = transactions[gameName][result][transId] * x[gameName];
// //         }
      
// //    // }
// //      }
// //      if(parseInt(gamemodedata.gameMode)==2){

// //      //let lwr;
// //       for (const num of sortResult) {
// //         let value = Object.values(num)[0];
// //         let key = Object.keys(num)[0];
// //         if (value < games[gameName].adminBalance) {
// //           if (games[gameName].position[result] != games[gameName].position[key]) {
// //             resultArray = [];
// //           }
// //           resultArray.push(key);
// //           result = resultArray[Math.floor(Math.random() * (resultArray.length-1))];
// //           lowestResult = result;

// //         }
// //         if (value > games[gameName].adminBalance) {
// //           break;
// //         }
// //       }
// //   let counter = 0;
// //   if (games[gameName].position[result])
// // while (games[gameName].adminBalance < games[gameName].position[result]) {
// //   result = Math.round(Math.random() * stopNum);
// //   counter++;

// //   if (counter == 100) {
// //     //aaya Error mali ti
// //     if (lowestResult != "") result = lowestResult;
// //     else result = Math.round(Math.random() * stopNum);
// //     break;
// //   }
// // }

// // if (result == "") {
// //   result = Math.round(Math.random() * stopNum);
// // }
// //         console.log("funtarget mdeuim mode result",result);
      
      
      
// //         if(x[gameName]==2){
// //           console.log("funtarget low mode result",x[gameName]);
// //         for (const transId in transactions[gameName][result]) {
// //          transactions[gameName][result][transId] = transactions[gameName][result][transId] * x[gameName];
// //        }
// //       }
// //      }
// //      if(parseInt(gamemodedata.gameMode)==1){

// //       sortarray = sortResult.sort((a, b) => Object.values(a)[0] - Object.values(b)[0]);
// //       console.log("sortarray  in game mode ",sortarray);
// //       console.log("sortarray  in game mode  lenght ",sortarray.length);
// //     //  result=sortarray[sortarray.length - 1];
// //         for(let i=sortarray.length-1;i>=0;i--){
// //           console.log("key in hight mode ",sortarray[i]);
            
// //           let value = Object.values(sortarray[i])[0];
// //             let key = Object.keys(sortarray[i])[0];
// //              console.log("key in hight mode ",value);
// //             //  if(x[gameName]==2){
// //             //   value = value * 2;
// //             //  }
// //              if (value< games[gameName].adminBalance) {
// //              result=key;
// //              break;
// //           }
// //         }
// //       // for (const num of sortResult) {
// //       //   let value = Object.values(num)[0];
// //       //   let key = Object.keys(num)[0];
       
// //       //   if (value < games[gameName].adminBalance) {
// //       //     result = key;
// //       //   }
// //       //   if (value > games[gameName].adminBalance) {
// //       //     break;
// //       //   }
// //       // }
// //       console.log("funtarget high mode result",result);
// //       if (result == "") {
// //         result = Math.round(Math.random() * stopNum);
// //       }
        
     
// //      // let valuesArray = Object.values(result);
// //     //  let keysArrayre = Object.keys(result);

// //       // Access the first (and only) key in the array and convert it to a number
// //       //const key = parseInt(keysArrayre[0], 10);
// // // Access the first (and only) value in the array
// //    //  result = parseInt(keysArrayre[0], 10);
// //       console.log("funtarget high mode result",result);
// //       if(x[gameName]==2){
// //         console.log("funtarget 2x in ",result);
   
    
// //         for (const transId in transactions[gameName][result]) {
// //           transactions[gameName][result][transId] = transactions[gameName][result][transId] * x[gameName];
// //         }
      
// //     }
// //     //   if(x[gameName]==2){
// //     //     console.log("funtarget  high mode result",x[gameName]);
// //     //   for (const transId in transactions[gameName][result]) {
// //     //    transactions[gameName][result][transId] = transactions[gameName][result][transId] * x[gameName];
// //     //  }
// //     // }

// //      }
  
// //      console.log("isWinByAdmin else  sort end",isWinByAdmin);
// //      console.log("result",result);
// //      console.log("x",x[gameName]);
// //      console.log("isWinByAdmin",isWinByAdmin);
// //      console.log("gameName",winnerNumber[gameName]);
    
// //   }
// // }else{
// //   console.log("==================================================else================================================");
// //   console.log("isWinByAdmin else",isWinByAdmin);
// //   console.log("result in else",result);
// //   console.log("x",x[gameName]);
// //   console.log("isWinByAdmin",isWinByAdmin);
// //   console.log("gameName",winnerNumber[gameName]);
 
// //   if(xcnt==Math.floor(Math.random() * 5) + 1)
// //   {
// //     x[gameName]=2;
// //     xcnt=0;
// //   }else{
// //     x[gameName]=1;
// //     xcnt++;
// //   }
// //   result = Math.floor(Math.random() * 10)
// //   ;
// //   console.log("result",result);
// //   console.log("================================================= close=else================================================");
  
// // }
// let lowestResult = "";
// let x = 1;
// if(isWinByAdmin==true)
//   {
//     console.log("result",result);
//     console.log("x",x);
//     console.log("isWinByAdmin",isWinByAdmin);
//     console.log("gameName",winnerNumber[gameName]);
//     result = winnerNumber[gameName];
//     for (const transId in transactions[gameName][result]) {
      
//       transactions[gameName][result][transId] = transactions[gameName][result][transId] *x;
//     }
//   }else{
// if (Object.keys(games[gameName].position).length != undefined) {
//   sortResult = sortObject(games[gameName].position);

//   for (const num of sortResult) {
//     let value = Object.values(num)[0];
//     let key = Object.keys(num)[0];
//     if (value < games[gameName].adminBalance) {
//       if (games[gameName].position[result] != games[gameName].position[key]) {
//         resultArray = [];
//       }
//       resultArray.push(key);
//       result = resultArray[Math.floor(Math.random() * resultArray.length)];
//       lowestResult = result;
//     }
//     if (value > games[gameName].adminBalance) {
//       break;
//     }
//   }
// }


// if (result == "") {
//   result = Math.round(Math.random() * stopNum);
// }


// let counter = 0;
// if (games[gameName].position[result])
// while (games[gameName].adminBalance < games[gameName].position[result]) {
//   result = Math.round(Math.random() * stopNum);
//   counter++;

//   if (counter == 100) {
//     //aaya Error mali ti
//     if (lowestResult != "") result = lowestResult;
//     else result = Math.round(Math.random() * stopNum);
//     break;
//   }
// }
// x=2;
// if (games[gameName].adminBalance > games[gameName].position[result] * x) {
//   console.log("aaya 2x me");
//   for (const transId in transactions[gameName][result]) {
//     transactions[gameName][result][transId] =
//       transactions[gameName][result][transId] * x;
//   }
// } else 
// {
// x = 1;
// console.log("aaya 1xxxx me");
// for (const transId in transactions[gameName][result]) {
//   transactions[gameName][result][transId] =
//     transactions[gameName][result][transId] * x;
// }
// }
//   }
// // io.in(gameName).emit("res", {
// // data: {
// //   gameName,
// //   data:Number(result),
// //   x,
// // },
// // en: "result",
// // status: 1,
// // });
// // if (games[gameName].position[result])
// // games[gameName].adminBalance -= games[gameName].position[result];





// console.log("==================================================if else out side================================================");
 
//   console.log("result",result);
//   console.log("x",x);
//   console.log("isWinByAdmin",isWinByAdmin);
//   console.log("gameName",winnerNumber[gameName]);
  
//   winnerNumber[gameName]=result;
//   console.log("gameName",winnerNumber[gameName]);
//   console.log("result emit   x ===",x);
//   io.in(gameName).emit("res", {
//     data: {
//       data: result,
//       x: x,
//       gameName
//     },
//     en: "result",
//     status: 1,
//   });
//   console.log("================================================= close=else================================================");


//   if (games[gameName].position[result]) games[gameName].adminBalance -= games[gameName].position[result] * x;

//   await addGameResult(result, x, isWinByAdmin[gameName], gameName,games[gameName].adminBalance);

//   await payTransaction(result, gameName);

//   // Pay Out of the winners

//   flushAll(gameName);
//   let numbers = await getLastrecord(gameName);
//   let dataAdmin = await getAdminData(gameName);
//   io.to("adminData" + gameName).emit("resAdmin", {
//     data: games.position,
//     gameName,
//     numbers: numbers.records.splice(0, 5),
//     x: numbers.x.splice(0, 5),
//     time: new Date().getTime() / 1000 - games.startTime,
//     dataAdmin,
//   });
// };

// payTransaction = async (result, gameName) => {
//   console.log("result", result, gameName);
//   if (transactions[gameName].length != 0)
//     if (transactions[gameName][result]) {
//       for (const transId in transactions[gameName][result]) {
//         console.log("Result Price is :", transactions[gameName][result], transactions[gameName][result][transId]);
//         let userId = await winGamePay(
//           transactions[gameName][result][transId],
//           transId,
//           result
//         );
//         io.to(retailers[userId]).emit("res", {
//           winnerNumber: result,
//           gameName,
//           data: {
//             data: { winAmount: transactions[gameName][result][transId] },
//           },
//           en: "winner",
//           status: 1,
//         });
//       }
//     }
// };

// sortObject = (entry) => {
//   const sortKeysBy = function (obj, comparator) {
//     var keys = _.sortBy(_.keys(obj), function (key) {
//       return comparator ? comparator(obj[key], key) : key;
//     });

//     return _.map(keys, function (key) {
//       return { [key]: obj[key] };
//     });
//   };

//   const sortable = sortKeysBy(entry, function (value, key) {
//     return value;
//   });
//   return sortable;
  
// };

// flushAll = (gameName) => {
//   winnerNumber[gameName] = 0;
//   games[gameName].position = {};
//   transactions[gameName] = {};
//  // isWinByAdmin[gameName] = false;
//   x = 1;
//   isWinByAdmin = false;
// };

// playGame = (position, result, gameName) => {
//   let multiplyer = 10;
//   if (gameName == "playToWin")
//     multiplyer = 10;
//   for (let pos in position) {
//     games[gameName].position = immutable.update(games[gameName].position, [pos], (v) =>
//       v ? v + position[pos] * multiplyer : position[pos] * multiplyer
//     );
//     transactions[gameName] = immutable.update(transactions[gameName], [pos, result], (v) =>
//       v ? v + position[pos] * multiplyer : position[pos] * multiplyer
//     );
//   }
//   console.log( games[gameName].position);
//   console.log( transactions[gameName]);
// };
