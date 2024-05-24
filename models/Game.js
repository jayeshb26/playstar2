const mongoose = require('mongoose');


const GameSchema = new mongoose.Schema({
    GameID: Number,
    ActiveInGame: Boolean,
    GameName: String,
    SortOrder: Number
});


const Game = mongoose.model('Game', GameSchema);

module.exports = Game;
