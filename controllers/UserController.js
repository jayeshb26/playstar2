const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { logout } = require("./ResultController");

const UserController = {
  retailerLogin: async (req, res) => {
    try {
      const { Code, Password } = req.body;
      const user = await User.findOne({ Code, Password });

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      // const AuthToken = jwt.sign(
      //   { id: user._id },
      //   process.env.ACCESS_TOKEN_SECRET
      // );

      const userData = {
        Code: user.Code,
        StockistID: user.StockistID,
        Pass: user.Pass,
        UserName: user.UserName,
        SystemID: user.SystemID,
        DnT: user.DnT,
        IsActive: user.IsActive,
        MaxBalance: user.MaxBalance,
        Balance: user.Balance,
        IsPrintTicket: user.IsPrintTicket,
        IsPrintCancel: user.IsPrintCancel,
        IsPrintClaim: user.IsPrintClaim,
        AutoClaim: user.AutoClaim,
        ShowJackpot: user.ShowJackpot,
        AuthToken: 1111111111,
        ShowAllDraw: user.ShowAllDraw,
        AutoBet: user.AutoBet,
        Message: "Login successful.",
        Status: true,
        ID: user.ID,
      };

      // res.cookie("AuthToken", AuthToken, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: "None",
      // }).status(200).json(userData);
      res.status(200).json(userData );
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  logout: async (req, res) => {
    try {
      const AuthToken = req.body.AuthToken;

      if (!AuthToken || AuthToken === undefined || AuthToken === null) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      // Delete or expire the access token here
      res.clearCookie("AuthToken");
      res.status(200).json({ message: "Logout successful" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

  module.exports = UserController;
