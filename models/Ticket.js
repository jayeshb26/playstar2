// ticketModel.js

const mongoose = require('mongoose');
 //const autoIncrement = require('mongoose-auto-increment');
const ticketSchema = new mongoose.Schema({
    TicketID: { type: Number },
    GameID: { type: Number, required: true },
    GameIDLists: { type: [Number], default: null },
    RetailerID: { type: Number, required: true },
    GameTypeID: { type: Number, required: true },
    TotalAmount: { type: Number, required: true },
    AutoClaim: { type: Boolean, required: true },
    DrawTime:{ type:String, required: true },
    Details: [{
        Item: { type: String, required: true },
        Point: { type: Number, required: true },
        ChanceID: { type: Number, required: true }
    }],
    DrTime: {
        type: String,
        default: () =>
          new Date()
            .toISOString("en-US", {
              timeZone: "Asia/Calcutta",
            })
            .toString()
            .split(",")[1],
      },
      DrDate: {
        type: String,
        default: () =>
          new Date()
            .toISOString("en-US", {
              timeZone: "Asia/Calcutta",
            })
            .toString()
            .split(",")[0]
            .replace(/\//g, (x) => "-"),
      },
      createDate: {
        type: Date,
        default: () =>
          new Date()
            .toISOString("en-US", {
              timeZone: "Asia/Calcutta",
            })
            .toString(),
      },
      winPosition: {
        type: String,
        default: "",
      },
      startPoint: {
        type: Number,
      },
      endPoint: {
        type: Number,
      },
      won: {
        type: Number,
        default: 0,
      },
      status: {
        type: Number,
        default: 0,
      },
      claim: {
        type: Boolean,
        default: false,
      },  IsCancelled: {
        type: Boolean,
        default: false,
      },  
       
      CancelTime: { type:String },
      ClaimTime:{ type:String },
  
      x: {
        type: String,
        default: "N",
      },
    AccessCode: { type: String, required: true },
    AuthToken: { type: String, required: true }
});

ticketSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    try {
        const lastTicket = await Ticket.findOne({}, {}, { sort: { 'TicketID': -1 } });
        const lastTicketID = lastTicket ? lastTicket.TicketID : 0;
        console.log("ddd",lastTicketID);
        this.TicketID = lastTicketID + 1;
        next();
    } catch (error) {
        next(error);
    }
});
//ticketSchema.plugin(autoIncrement.plugin, { model: 'Ticket', field: 'TicketID' });

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
