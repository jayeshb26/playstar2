const GameDetails = require('../models/GameDetails');
const Games = require('../models/Game');
process.env.TZ='Asia/Kolkata' ;
const GameController = {
    getGameList: async (req, res) => {
        try {
            const GameID = parseInt(req.body.GameID);
            console.log('GameID: ', GameID);
            let gameDetails;
            if (GameID === 0) {
              // Display all games
              gameDetails = await Games.find({});
            } else {
              // Retrieve details for the selected gameID
              gameDetails = await Games.findOne({ GameID: GameID });
            }
            
            if (!gameDetails) {
              return res.status(404).json({ message: 'Game details not found' });
            }
            
            const response = {
                datalist: Array.from(gameDetails),
                Message: 'Game details received.',
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
            
            const  LeaveFootprint  = req.query.LeaveFootprint;
            const gameId = req.query.GameID;
            if( LeaveFootprint === true){
                
                const gameDetails = await GameDetails.findOne({  }); //GameID: req.query.GameID

                if (!gameDetails) {
                    return res.status(404).json({ message: 'Game details not found' });
                }
                
                const response = {
                    GameTypeID: gameDetails.GameTypeID,
                    TimeSpan: gameDetails.TimeSpan,
                    GameName: gameDetails.GameName,
                    CurrentTime:gameDetails.CurrentTime, 
                    DrawTime: gameDetails.DrawTime,
                    GameID: gameDetails.GameID,
                    OldResultList: gameDetails.OldResultList,
                    Message: 'Game details received.',
                    Status: true,
                    ID: 0
                };
                console.log('============[Response - Start]===============');
                console.log(response);
                console.log('============[Response - End]=================');
                res.json(response);
            }else{
                const gameDetails = await GameDetails.findOne({ gameId });
                
                if (!gameDetails) {
                    return res.status(404).json({ message: 'Game details not found' });
                }
                
                const response = {
                    GameTypeID: gameDetails.GameTypeID,
                    TimeSpan: gameDetails.TimeSpan,
                    GameName: gameDetails.GameName,
                    CurrentTime: gameDetails.CurrentTime, 
                    DrawTime: gameDetails.DrawTime,
                    GameID: gameDetails.GameID,
                    OldResultList: gameDetails.OldResultList,
                    Message: 'Game details received.',
                    Status: true,
                    ID: 0
                };
                console.log('============[Response - Start]===============');
                console.log(response);
                console.log('============[Response - End]=================');
                res.json(response);
            }
        } catch (error) {
            console.log('============[Error]=================');
            console.error(error);
            console.log('============[Error]=================');

            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = GameController;
