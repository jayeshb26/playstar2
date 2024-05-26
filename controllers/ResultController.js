const Result = require("../models/results");
const jwt = require("jsonwebtoken");

const ResultController = {
  getResult: async (req, res) => {
    try {
      const result = await Result.findOne({  });

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
