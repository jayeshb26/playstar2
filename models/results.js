const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
   // Balance: { type: Number, required: true }, //come from user's balance
    Result: { type: String, required: true },
    GameTypeId: { type: Number, default: 0 },
   
    JackpotMultiply: { type: String, default: 'N' },
    
    NextGameID: { type: Number, required: true },
    NextDrawTime: { type: String, required: true },
    CurrentTime: { type: Date, default: Date.now },
    Multiply:{ type: String, default: 'N' },
    DrawTime:{ type: String,default:true},
    gameID: { type: Number, required: true },
    Status:{ type: String,default:true},
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
