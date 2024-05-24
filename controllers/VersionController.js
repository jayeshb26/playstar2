const User = require("../models/User");
const express = require('express');
exports.UpdateCheck = (req, res) => {
  console.log({ express: 'Hello From Express' });
console.log("updateCheck");
  try {
    const versionID = req.query.versionID;
    const requestData = req.body;
    
  let response;
  if (!requestData.AuthToken || requestData.AuthToken === null || requestData.AuthToken === 0 || requestData.AuthToken === undefined) {
    response = {
      Message: null,
      Status: false,
      ID: parseInt(versionID)
    };
  } else {
    response = {
      Message: "Successfully updated.",
      Status: true,
      ID: 0
    };
  }

  return res.status(200).type('application/json').send({
    "statusCode": 200,
    "statusMsg": "success", 
    "data": response
});

  } catch (error) {
    console.log('============[Error]=================');
    console.log(error.Message);
    console.log('====================================');
  }
  };
  