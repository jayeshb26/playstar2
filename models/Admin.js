const mongoose = require("mongoose");

//Set you offset here like +5.5 for IST
var offsetIST = 19800000;

//Create a new date from the Given string
var d = new Date();

//To convert to UTC datetime by subtracting the current Timezone offset
var utcdate = new Date(d.getTime());

//Then cinver the UTS date to the required time zone offset like back to 5.5 for IST
var istdate = new Date(utcdate.getTime() + offsetIST);

const AdminSchema = new mongoose.Schema(
  {
    
    lastbalance: Number,
    newbalance: Number,
    
   
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
        new Date().getFullYear().toString() +
        "-" +
        (new Date().getMonth() + 1).toString() +
        "-" +
        new Date().getDate().toString(),
    },

    createDate: {
      type: Date,
      default: () => new Date(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminSchema);
