const express = require('express');
const uuid = require("uuid");
const mongoose = require('mongoose');
const {UserAccount,validateUser}= require('../models/UserModel/index')
const {Farmer,validate}= require('../models/FarmerModel/index')
const {Buyer,validateBuyer}= require('../models/BuyerModel/index')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const generateOutput= require('../utils/outputFactory')



//methods for sign in  function

async function signin(req,res) {
//validating the user

  const { error1 } = validateBuyer(req.body); 
  if (error1) return res.status(200).send(generateOutput(400,'validation error1',error1.details[0].message));
//check whether user is existed
  let user = await UserAccount.findOne({ email: req.body.email });
  if (!user) return res.status(200).send(generateOutput(400,'not exist',"Invalid Username or Password"));
let userDetails=null;
  if (user.userRole==='FARMER') {
    userDetails = await Farmer.findById(user._id);
  }else{
    userDetails = await Buyer.findById(user._id);
  }
//check the password
console.log(userDetails);
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(200).send(generateOutput(400,'not exist',"Invalid Username or Password"));
if (userDetails) {
    const token = user.generateAuthToken();
    return res.status(200).send(generateOutput(201,'token',{'token':token,'userRole':user.userRole,'firstName':userDetails.firstName,'lastName':userDetails.lastName}));
}else{
   return  res.status(200).send(generateOutput(400,'details not availble','details not availble'));
}
  
  
}
  
    
 
    
module.exports ={signin};