const express = require("express");
const uuid = require("uuid");
const mongoose = require("mongoose");
const { Farmer, validate } = require("../models/FarmerModel/index");
const { UserAccount, validateUser } = require("../models/UserModel/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const generateOutput = require("../utils/outputFactory");

//methods for farmer registration process

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
        const token = user.generateAuthToken();
        return res.send(
          generateOutput(201, "Farmer registered successfully", {
            _id: user._id,
            firstName: farmer.firstName,
            lastName: farmer.lastName,
            email: user.email,
            token: token,
          })
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

module.exports = { farmerRegister };
