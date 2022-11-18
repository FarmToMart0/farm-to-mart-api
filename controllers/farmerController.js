const express = require("express");
const uuid = require("uuid");
require('dotenv').config();
const mongoose = require("mongoose");
const { Farmer, validate } = require("../models/FarmerModel/index");
const { UserAccount, validateUser } = require("../models/UserModel/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const generateOutput = require("../utils/outputFactory");
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');


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



async function farmerRegister(req, res) {
  req.body.userRole = "FARMER";
  //validating the user details
  const { error1 } = validate(req.body);
  const { error2 } = validateUser(req.body);
  if (error1 || error2) {
    const output = generateOutput(
      400,
      "validate error",
      error1?.details[0].message || error2?.details[0].message
    );
    return res.status(200).send(output);
  }
  try {

    //check whether already existed
    let user = await Farmer.findOne({ nic: req.body.nic });

    if (user) {
      //send user already registed message
      return res
        .status(200)
        .send(
          generateOutput(
            400,
            "validate error",
            "This NIC has already registered"
          )
        );
    } else {
      let user1 = await UserAccount.findOne({ email: req.body.email });
      if (user1) {
        return res
          .status(200)
          .send(
            generateOutput(
              400,
              "validate error",
              "This email has already been taken"
            )
          );
      }
      //transaction for user register
      const session = mongoose.startSession();
      (await session).startTransaction();
      try {
        user = new UserAccount(
          _.pick(req.body, ["email", "password", "userRole"])
        );
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        await user.save();

        const farmer = new Farmer(
          _.pick(req.body, [
            "firstName",
            "lastName",
            "address",
            "phone",
            "district",
            "gsdName",
            "gsdCode",
            "nic",
          ])
        );
        farmer._id = user._id;
        await farmer.save();
        // Commit the changes
        await (await session).commitTransaction();
        const token = user.generateAuthToken(user);
             // Step 3 - Email the user a unique verification link
       const url = `http://localhost:3000/verify/${token}`
      
       transporter.sendMail({
         to: req.body.email,
         subject: 'Verify Account',
         html: `Click <a href = '${url}'>here</a> to confirm your email.`
       })
      
       return res.status(200).send(
        generateOutput(201,'send','Verification mail sent')
       );
       
      } catch (error) {
        console.log(error);
        // Rollback any changes made in the database
        await (await session).abortTransaction();

        // Rethrow the error
      }
    }
    //sending generated token to Farmer
  } catch (error) {
    console.log(error);
    return res.status(200).send(generateOutput(500, "error", "Server Error"));
  }
}


//function for get farmer details
async function getFarmerDetails(req,res){
  try{
      let farmer = await Farmer.findOne({ "nic": req.params.nic });
      console.log(farmer)
      res.status(200).send(generateOutput(201,'success',farmer));
  } catch (error){
      logger.error(error)
      res.status(200).send(generateOutput(500,'error','Something went wrong'));
  }
}

//function for register farmer by gso
async function  gsoRegisterFarmer(req,res) {
  req.body.userRole='FARMER'
  //validating the user details
  const { error1 } = validate(req.body);
  const { error2 } = validateUser(req.body);
  if (error1 || error2){
      const output = generateOutput(400,'validate error',error1?.details[0].message || error2?.details[0].message )
      return res.status(200).send(output);
  } 
  try {
    //check whether already existed
    let user = await Farmer.findOne({ nic: req.body.nic });
    if (user) {
      //send user already registed message
        return res.status(200).send(generateOutput(400,'validate error','This NIC has already registered'));
    }else{
      let user1 = await UserAccount.findOne({ email: req.body.email });
      if (user1) {
          return res.status(200).send(generateOutput(400,'validate error','This email has already been taken'));
      }
      //transaction for user register
      const session = mongoose.startSession();
      (await session).startTransaction();
      try {
            user = new UserAccount(_.pick(req.body, [ 'email', 'password','userRole']));
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
            await user.save();
        
            const  farmer = new Farmer(_.pick(req.body, ['firstName', 'lastName','address','phone','district','gsdName','gsdCode','nic',]));
            farmer._id=user._id
            await farmer.save();
            // Commit the changes
            await (await session).commitTransaction();
            return  res.send(generateOutput(201,'Farmer registered successfully',{'_id':user._id,'firstName':farmer.firstName,'lastName':farmer.lastName,'email':user.email}) );
                
      }catch(error){
        console.log(error)
        // Rollback any changes made in the database
      await (await session).abortTransaction();
        }
      }
    
  } catch (error) {
    console.log(error);
    return res.status(200).send(generateOutput(500,'error','Server Error'));
    }
}

async function checkAvailability(req,res){
  //console.log(req.body, "given")
  var nic = req.body.nic;
  try{
    var farmer = await Farmer.findOne({ "nic": nic });
    console.log(farmer)
    if (farmer.status !== "removed"){
      return res.status(200).send(generateOutput(201,'success',farmer))
    } 

  }catch(error){

  }
}

async  function removefarmer(req,res) {

  req.body.status = "removed"
  var id = req.body.farmerDetails._id;

  try {

      let removedFarmer = await Farmer.findByIdAndUpdate(id,_.pick(req.body, ['status']))
      let removedUser = await UserAccount.findByIdAndUpdate(id,_.pick(req.body, ['status']))
      if (!removedFarmer) return res.status(200).send(generateOutput(404,'not found','The farmer with the given ID was not found.'));
      res.status(200).send(generateOutput(201,'successfully removed'));
  } catch (error) {
      logger.error(error)
      return res.send(generateOutput(500,'error','Error occured while updating product') );
  }
}

async function getUserDetailsFarmer(req, res){
  console.log(req.body.farmerDetails)
  var id = req.body.farmerDetails._id;
  console.log(id, "id")
  try{
      
    let user = await UserAccount.findOne({ "_id": id });
    console.log(user)
    res.status(200).send(generateOutput(201,'success',user));
  } catch (error){
    logger.error(error)
    res.status(200).send(generateOutput(500,'error','Something went wrong'));
}
}
    
module.exports ={farmerRegister, getFarmerDetails, gsoRegisterFarmer,checkAvailability, removefarmer, getUserDetailsFarmer};

