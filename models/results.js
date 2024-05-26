const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    balance: { type: Number, required: true }, //come from user's balance
    result: { type: String, required: true },
    jackpotMultiply: { type: String, default: 'N' },
    nextGameID: { type: Number, required: true },
    nextDrawTime: { type: Date, required: true },
    winPoint: { type: Number, default: 0 },
    currentTime: { type: Date, default: Date.now },
    gameID: { type: Number, required: true },
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
