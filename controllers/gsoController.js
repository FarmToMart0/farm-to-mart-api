const express = require("express");
const uuid = require("uuid");
const mongoose = require("mongoose");
const { Gso, validate, validateUpdate } = require("../models/GSOModel/index");
const { UserAccount, validateUser } = require("../models/UserModel/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const _ = require("lodash");
const generateOutput = require("../utils/outputFactory");
const logger = require("../utils/logger");
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


//methods for gso registration process
async function  gsoRegister(req,res) {
    req.body.userRole = 'GSO'
    console.log(req.body)
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
    let user = await Gso.findOne({ nic: req.body.nic });

        if (user) {
            //send user already registed message
            return res.status(200).send(generateOutput(400,'validate error','This NIC has already registered'));
        }else{
            let user1 = await UserAccount.findOne({ email: req.body.email });
            if (user1) {
                //send user already registed message
                return res.status(200).send(generateOutput(400,'validate error','This email has already been taken'));
            }else{
                let user2 = await Gso.findOne({ gsdCode: req.body.gsdCode });

                if (user2) {
                    //send user already registed gso message
                    console.log(user2)
                    return res.status(200).send(generateOutput(400,'validate error','This GSO code has already registered'));
                }
                const session = mongoose.startSession();
                (await session).startTransaction();
                try {
                    user = new UserAccount(_.pick(req.body, [ 'email', 'password','userRole']));
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(req.body.password, salt);
                    console.log(user)
                    await user.save();

                    const  gso = new Gso(_.pick(req.body, ['firstName', 'lastName','mobile','district','gsdName','gsdCode','nic',]));
                    gso._id=user._id
                    await gso.save();
                   
                    // Commit the changes
                    await (await session).commitTransaction();
                    const token = user.generateAuthToken(user);
                    // Step 3 - Email the user a unique verification link
                    const url = `${process.env.BASE_URL}/verify/${token}`
                    transporter.sendMail({
                        to: req.body.email,
                        subject: ` Verify Account`,
                        html: `Click <a href = '${url}'>here</a> to confirm your Registration.`
                      })
                   
                      return res.status(200).send(
                       generateOutput(201,'send',`Verification mail sent to ${req.body.email}`)
                      );

                    
                }

                catch(error){
                    console.log(error)
                    // Rollback any changes made in the database
                    await (await session).abortTransaction();
                }
            }

            //transaction for user register
            
        }
    }
    catch(error){
        console.log(error)
        return res.status(200).send(generateOutput(400,'validate error','Something went wrong'));
    }
  } 


//function for get gso details process
async function getGsoDetails(req,res){
    try{
        console.log(req.params.nic )
        let gso = await Gso.findOne({ "nic": req.params.nic });
        console.log(gso)
        res.status(200).send(generateOutput(200,'success',gso));
    } catch (error){
        logger.error(error)
        res.status(200).send(generateOutput(500,'error','Something went wrong'));
    }
}

//function for removing gso
async function removeGso(req,res){
    var id = req.body._id;
    try {
        let gso = await Gso.findByIdAndRemove(id)
        let user = await UserAccount.findByIdAndRemove(id)
        if(!(gso && user)){
            return res.status(200).send(generateOutput(404,'not found','The gso with the given ID was not found.'))    
        }
        return res.status(200).send(generateOutput(201,'success','successfully removed'))
        
    } catch (error) {
        logger.error(error)
        return res.status(200).send(generateOutput(500,'error','error occured while removing gso'))
    }
}

async function checkAvailabilityGSO(req,res){
    var nic = req.body.nic;
    try{
      var gso = await Gso.findOne({ "nic": nic });
      console.log(gso)
      
      return res.status(200).send(generateOutput(201,'success',gso))
      
    }catch(error){
  
    }
  }

async function getUserDetailsGso(req, res){
    console.log(req.body.gsoDetails)
    var id = req.body.gsoDetails._id;
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

async function editGSO(req,res){
    body = req.body
    console.log(body)
    const {error} = validateUpdate(body)
    if (error){
        return res.status(200).send(generateOutput(400, "validation error", error.details[0].message));
    }
    try{
        let updatedgso = await Gso.findByIdAndUpdate(body._id, _.pick(body, ["firstName", "lastName", "mobile"]))
        if (!updatedgso){
            return res.status(200).send( generateOutput(404,"not found","The gso with the given ID was not found."))
        }
        res.status(200).send(generateOutput(201, "success fully updated", updatedgso));
    }catch(error){
        logger.error(error);
        return res.send(generateOutput(500, "error", "Error occured while updating gso"));
    }
}

module.exports = {gsoRegister, getGsoDetails, removeGso, checkAvailabilityGSO, getUserDetailsGso,editGSO}

