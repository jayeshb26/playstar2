const mongoose = require("mongoose");

const PointLogListSchema = new mongoose.Schema(
  {
    GameID: { type: Number, required: true },
   
    RetailerID: { type: Number, required: true },
    
    TicketID: {
      type: Number,
      required: true,
    },

    UserCode: {
      type: String,
      required: [true, "Your System is not Verified"],
    },
    GameName: {
        type: String,
        default: "1",
      },
      PrevBal: {
        type: Number,
        default: 0.00,
      },
      AddPoint: {
        type: Number,
        default:0.00,
      },MinusPoint: {
        type: Number,
        default: 0.00,
      },
      NewBal: {
      type: Number,
      default:0.00,
    },
    DnT: {
         type: String,
        default: () =>
          new Date()
            .toLocaleString("en-US", {
              timeZone: "Asia/Calcutta",
            })
            .toString()
            .split(",")[0]
            .replace(/\//g, (x) => "-"),
        default:0.00,
      },
      TicketAdjType: {
        type: String,
        default:0.00,
      },
      TicketAdjType: {
        type: String,
        required: [true, "Your System is not Verified"],
      },
    DrTime: {
      type: String,
      default: () =>
        new Date()
          .toLocaleString("en-US", {
            timeZone: "Asia/Calcutta",
          })
          .toString()
          .split(",")[1],
    },
    DrDate: {
      type: String,
      default: () =>
        new Date()
          .toLocaleString("en-US", {
            timeZone: "Asia/Calcutta",
          })
          .toString()
          .split(",")[0]
          .replace(/\//g, (x) => "-"),
    },
    createDate: {
      type: String,
      default: () =>
        new Date()
          .toLocaleString("en-US", {
            timeZone: "Asia/Calcutta",
          })
          .toString(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PointLogList",PointLogListSchema);
