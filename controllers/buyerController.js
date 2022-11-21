const express = require("express");
const uuid = require("uuid");
const mongoose = require("mongoose");
const { Buyer, validateBuyer } = require("../models/BuyerModel/index");
const { UserAccount, validateUser } = require("../models/UserModel/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const generateOutput = require("../utils/outputFactory");
const nodemailer = require('nodemailer');
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




//methods for farmer registration process
async function buyerRegister(req, res) {
  req.body.userRole = "BUYER";
  //validating the user details
  const { error1 } = validateBuyer(req.body);
  const { error2 } = validateUser(req.body);
  if (error1 || error2) {
    const output = generateOutput(
      400,
      "validate error",
      error1?.details[0].message || error2?.details[0].message
    );
    return res.status(400).send(output);
  }
  try {
    //check whether already existed
    let user = await Buyer.findOne({ nic: req.body.nic });

    if (user) {
      //send user already registed message
      return res
        .status(400)
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
        user = new UserAccount(_.pick(req.body, ["email", "password", "userRole"]));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        await user.save();

        const buyer = new Buyer(_.pick(req.body, [
            "firstName",
            "lastName",
            "address",
            "phone",
            "district",
            "nic",
          ])
        );
        buyer._id = user._id;
        await buyer.save();
        
        
        // Commit the changes
        await (await session).commitTransaction();
        const token = user.generateAuthToken(user);
        const url = `${process.env.BASE_URL}/verify/${token}`
      
        transporter.sendMail({
          to: req.body.email,
          subject: `Hi ${req.body.firstName} ${req.body.lastName} Verify Account`,
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

module.exports = { buyerRegister };
