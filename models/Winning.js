const mongoose = require("mongoose");

const WinningSchema = new mongoose.Schema({
    percent: {
        type: Number,
        default: 0
    },  gameMode: {
        type: String,
      
    }

}, { timestamps: true })
module.exports = mongoose.model("Winning", WinningSchema);
