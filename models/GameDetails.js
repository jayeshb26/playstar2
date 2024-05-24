const mongoose = require('mongoose');


const gameDetailsSchema = new mongoose.Schema({
  GameTypeID: Number,
  TimeSpan: Number,
  GameName: String,
  DrawTime: String,
  GameID: Number,
  OldResultList: [
    {
      Result: String,
      DrawTime: String,
      Multiply: String
    }
  ]
});


const GameDetails = mongoose.model('GameDetails', gameDetailsSchema);

module.exports = GameDetails;
