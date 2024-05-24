const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../models/User");

async function getUserInfo(userId) {
  //Verify Token
  try {
    user = await User.findById(userId);
    return user;
  } catch (err) {
    return err.message;
  }
}
async function getUserInfoBytoken(tokenId) {

  let token;
  //Set token from Bearer token in header
  token = tokenId.toString();
  //Verify Token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    user = await User.findById(decoded.id);
    return user;
  } catch (err) {
    return err.message;
  }
}
async function logOutUser(userId) {
  //Verify Token
  try {
    console.log("logout ************************************************", userId)
    let DD = await User.findByIdAndUpdate(mongoose.Types.ObjectId(userId), { isLogin: false }, { new: true });
    console.log("hnchdsbscbasjccccccccccccccccclcbnsdlvcjbsdkvcbslvjhb", DD)
  } catch (err) {
    console.log("logout error ************************************************", err.message)
    return err.message;
  }
}
module.exports = { getUserInfo, getUserInfoBytoken, logOutUser };