const express = require("express");
const uuid = require("uuid");
require('dotenv').config();
const mongoose = require("mongoose");
const { UserAccount, validateUser } = require("../models/UserModel/index");
const { ResetPassword,validateReset } = require("../models/ResetPassword/index");
const { Buyer, validateBuyer } = require("../models/BuyerModel/index");
const { Farmer, validate } = require("../models/FarmerModel/index");
const {Gso} = require('../models/GSOModel/index')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generateOutput = require("../utils/outputFactory");
const logger = require("../utils/logger");
const nodemailer = require('nodemailer');
const { async } = require("@firebase/util");
const { reset } = require("nodemon");
//methods for farmer registration process
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // === add this === //
    tls : { rejectUnauthorized: false }
});




async function resetPasswordSendMessage(req,res) {
 
  try {
    var ObjectId = mongoose.Types.ObjectId;
    let user = await UserAccount.findOne({ email: req.body.email });
   
  if (!user)
    return res
      .status(200)
      .send(generateOutput(400, "not exist", "Please enter valid email address"));
  if (!user.verified) {
    return res
      .status(200)
      .send(generateOutput(405, "not verified", "Your account has not been verified yet"));
  }
  
      
        const token = user.generateAuthToken(user);
        var reset = new ResetPassword({email:user.email,userId:ObjectId(user._id),token:token})
        await reset.save();
      
        
        generateOutput(500,'error','error')
      
      
        
             // Step 3 - Email the user a unique verification link
        const url = `${process.env.BASE_URL}/resetpassword/${req.body.email}/${reset._id}/${token}`
       transporter.sendMail({
         to: req.body.email,
         subject: 'Password reseting',
         html: `Click <a href = '${url}'>here</a> to reset the Password.`
       })
       return res.status(200).send(
        generateOutput(201,'send','Email has been sent for reset the password')
       );
  } catch (error) {
    return res.status(200).send(
      generateOutput(500,'error',error)
     );
  }
}

async function checkExpired(req,res){
  var ObjectId = mongoose.Types.ObjectId;
  var id = req.body.id;
  var token = req.body.token;
  
try {
  var user = await ResetPassword.findById(id);
 
  if (user.status) {
    return res.status(200).send(generateOutput(401,'error','Yor link is expired'));
  }
  else{
    return res.status(200).send(generateOutput(201,'error','Yor link is not expired'));
  }
}catch(error){
  return res.status(200).send(generateOutput(400,'error','error occured'));
}
}
async function passwordReset(req,res){
  var ObjectId = mongoose.Types.ObjectId;
  var id = req.body.id;
  var token = req.body.token;
  
try {
  console.log('body',req.body)
  var user = await ResetPassword.findById(id);
  if (user.status) {
    return res.status(200).send(generateOutput(401,'error','Yor link is expired'));
  }
  const salt = await bcrypt.genSalt(10);
  const pass = await bcrypt.hash(req.body.password, salt);
 
  var rest = await UserAccount.updateOne( { 'email': req.body.email }, { $set: { 'password': pass }})
   var state = await ResetPassword.updateOne({ _id: id }, { $set: { status: true }} )
  return res.status(200).send(generateOutput(201,'suceess','password reset successfully'));
} catch (error) {
  logger.error(error)
  return res.status(200).send(generateOutput(400,'error','Error occured while reseting password'));
}
  

}
async function verify(req, res)  {
  const { token } = req.params
  
  // Check we have an id
  if (!token) {
      return res.status(200).send(generateOutput(403,'forbiden','Token missing'));
  }
  // Step 1 -  Verify the token from the URL
  let payload = null
  try {
      payload = jwt.verify(
         token,
         process.env.TOKEN_SECRET
      );
      
  } catch (err) {
    logger.error(err)
    return res.status(200).send(generateOutput(403,'error',err));
  }
  
  try{
      // Step 2 - Find user with matching ID
     
      const user = await UserAccount.findOne({ _id: payload.id }).exec();
     
      if (!user) {
        logger.error('error')
        return res.status(200).send(generateOutput(400,'error','User doesnt exist'));
      }
      // Step 3 - Update user verification status to true
      user.verified = true;
      await user.save();
      console.log(user)
      let userDetails = null;
      if (user.userRole === "FARMER") {
        userDetails = await Farmer.findById(user._id);
      } else if(user.userRole === "BUYER"){
        userDetails = await Buyer.findById(user._id);
  }else if (user.userRole === "GSO") {
    userDetails = await Gso.findById(user._id);
  }
  console.log(userDetails)
      return res.status(200).send(generateOutput(201, "verified", {
        _id: user?._id,
        token: token,
        userRole: user?.userRole,
        firstName: userDetails?.firstName,
        lastName: userDetails?.lastName,
        address: userDetails?.address,
        district: userDetails?.district,
        gsdCode: userDetails?.gsdCode,
        gsdZone: userDetails?.gsdName,
        nic: userDetails?.nic,
        phone: userDetails?.phone,
        city: userDetails?.city,
      }));
   } catch (err) {
    logger.error(err)
    return res.status(200).send(generateOutput(500,'error',err));
   }
}






//methods for sign in  function
async function signin(req, res) {
  //validating the user
  const { error1 } = validateUser(req.body);
  if (error1)
    return res
      .status(200)
      .send(
        generateOutput(400, "validation error1", error1.details[0].message)
      );
  //check whether user is existed
  let user = await UserAccount.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(200)
      .send(generateOutput(400, "not exist", "Invalid Username or Password"));
  if (!user.verified) {
    return res
      .status(200)
      .send(generateOutput(405, "not verified", "Your account has not been verified yet"));
  }
  let userDetails = null;
  if (user.userRole === "FARMER") {
    userDetails = await Farmer.findById(user._id);
  } else {
    userDetails = await Buyer.findById(user._id);
  }
  //check the password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res
      .status(200)
      .send(generateOutput(400, "not exist", "Invalid Username or Password"));
  if (userDetails) {
    const token = user.generateAuthToken(user);
    return res
      .status(200)
      .send(
        generateOutput(201, "token", {
          _id: user?._id,
          token: token,
          email:user?.email,
          phone:userDetails?.phone,
          userRole: user?.userRole,
          firstName: userDetails?.firstName,
          lastName: userDetails?.lastName,
          address: userDetails?.address,
          district: userDetails?.district,
          gsdCode: userDetails?.gsdCode,
          gsdZone: userDetails?.gsdName,
          nic: userDetails?.nic,
          phone: userDetails?.phone,
          city: userDetails?.city,
        })
      );
  } else {
    return res
      .status(200)
      .send(
        generateOutput(400, "details not availble", "details not availble")
      );
  }
}


module.exports = { signin,verify,resetPasswordSendMessage,passwordReset,checkExpired};
