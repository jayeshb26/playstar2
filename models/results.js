const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    Balance: { type: Number, required: true }, //come from user's balance
    Result: { type: String, required: true },
    JackpotMultiply: { type: String, default: 'N' },
    NextGameID: { type: Number, required: true },
    NextDrawTime: { type: Date, required: true },
    WinPoint: { type: Number, default: 0 },
    CurrentTime: { type: Date, default: Date.now },
    gameID: { type: Number, required: true },
    Status:{ type: String,default:true},
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
