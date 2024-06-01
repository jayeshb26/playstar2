const GameDetails = require('../models/GameDetails');
const Games = require('../models/Game');
const User = require('../models/User');
const Result = require('../models/results');
//const Gametime = require('../socket/index');
process.env.TZ='Asia/Kolkata' ;
const GameController = {
    getGameList: async (req, res) => {
        try {
            const GameID = parseInt(req.body.GameID);
            console.log('GameID: ', GameID);
            // let gameDetails;
            // if (GameID === 0) {
            //   // Display all games
            //   gameDetails = await Games.find({}).select({_id:0});
            // } else {
            //   // Retrieve details for the selected gameID
            //   gameDetails = await Games.findOne({ GameID: GameID });
            // }
            
            gameDetails = await Games.find({}).select({_id:0});
            if (!gameDetails) {
              return res.status(404).json({ message: 'Game details not found' });
            }
            
            const response = {
                datalist: Array.from(gameDetails),
                Message: 'Data Received.',
                Status: true,
                ID: 0
            };
            
            console.log('============[Response - Start]===============');
            console.log(response);
            console.log('============[Response - End]=================');
            
            res.json(response);
            
        } catch (error) {
            console.log('============[Error]=================');
            console.error(error);
            console.log('============[Error]=================');

            res.status(500).json({ message: 'Internal server error' });
        }
    },
    getGameDetails: async (req, res) => {
        try {
            console.log(req.body);
            //let userDetails = await User.findOne({"ID":req.body.RetailerID});
            //console.log(userDetails.Balance);
            //let balance = userDetails.Balance;
            const  LeaveFootprint  = req.query.LeaveFootprint;
            const gameId = req.body.GameID;
            if(req.body.GameTypeID!=18){
                req.body.GameTypeID=18  
            }
            let gameDetails = await GameDetails.findOne({"GameTypeID":req.body.GameTypeID});
          // console.log( gameDetails.GameName);
          if (!gameDetails) {
            return res.status(404).json({ message: 'Game details not found' });
        }  
           let getLastrecord= await Result.find({"GameTypeId": gameDetails.GameTypeID}).sort({ '_id': -1 } ).select({Result:1,DrawTime:1,Multiply:1,_id:0}).limit(50);
    
        
        
         let data = [];
      //   data.push( getLastrecord);
         let x = [];
     
       console.log(data);
           
           let d1=new Date();
                d1.setHours(d1.getHours() + 5);
                d1.setMinutes(d1.getMinutes() + 30);
                console.log(getLastrecord);
                const response = {
                    GameTypeID: gameDetails.GameTypeID,
                    TimeSpan: gameDetails.TimeSpan,
                    GameName: gameDetails.GameName,
                    CurrentTime: d1.toISOString(), 
                    DrawTime: gameDetails.DrawTime,
                    GameID: gameDetails.GameID,
                    OldResultList: getLastrecord,
                    Message: 'Game details received.',
                    Status: true,
                    ID: 0
                };
                console.log('============[Response - Start]===============');
                console.log(response);
                console.log('============[Response - End]=================');
                res.status(200).json(response);
            
        } catch (error) {
            console.log('============[Error]=================');
            console.error(error);
            console.log('============[Error]=================');

            res.status(500).json({ message: 'Internal server error' });
        }
    },

    //postTicket: async (req, res) => {}
    
};

module.exports = GameController;
