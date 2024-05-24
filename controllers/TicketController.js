const Ticket = require("../models/Ticket")
const Users = require("../models/User")

const TicketController = {
    postTicket: async (req, res) => {
      try {
        const ticketData = req.body;
        const newTicket = await Ticket.create(ticketData);
        console.log(newTicket);
        
        const balance = 4806.0; 
        const currentTime = new Date();
        const ticketTime = new Date(); 

        res.status(201).json({
            TicketID: newTicket._id,
            Balance: balance,
            CurrentTime: currentTime,
            TicketTime: ticketTime,
            GameID: newTicket.GameID,
            GameIDLists: newTicket.GameIDLists,
            TicketIDList: newTicket.TicketIDList,
            Message: "Bet Accepted.",
            Status: true,
            ID: 0
        });

      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  module.exports = TicketController;
