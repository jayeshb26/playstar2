// ticketModel.js

const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    GameID: { type: Number, required: true },
    GameIDLists: { type: [Number], default: null },
    RetailerID: { type: Number, required: true },
    GameTypeID: { type: Number, required: true },
    TotalAmount: { type: Number, required: true },
    AutoClaim: { type: Boolean, required: true },
    Details: [{
        Item: { type: String, required: true },
        Point: { type: Number, required: true },
        ChanceID: { type: Number, required: true }
    }],
    AccessCode: { type: String, required: true },
    AuthToken: { type: String, required: true }
});

ticketSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    try {
        const lastTicket = await Ticket.findOne({}, {}, { sort: { 'TicketID': -1 } });
        const lastTicketID = lastTicket ? lastTicket.TicketID : 0;
        this.TicketID = lastTicketID + 1;
        next();
    } catch (error) {
        next(error);
    }
});


const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
