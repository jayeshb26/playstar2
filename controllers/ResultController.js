const Result = require("../models/WinResult");
const jwt = require("jsonwebtoken");

const ResultController = {
  getResult: async (req, res) => {
    try {
      const result = await Result.findOne({ GameID: req.body.GameID });

      if (!result) {
        return res.status(404).json({ message: "Result not found" });
      }

      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

module.exports = ResultController;
