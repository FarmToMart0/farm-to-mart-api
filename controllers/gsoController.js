const express = require("express");
const uuid = require("uuid");
const mongoose = require("mongoose");
const { Gso, validate } = require("../models/GSOModel/index");
const { UserAccount, validateUser } = require("../models/UserModel/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const generateOutput = require("../utils/outputFactory");
const logger = require("../utils/logger");


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
                let user2 = await Gso.findOne({ gsoCode: req.body.gsoCode });

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

                    const  gso = new Gso(_.pick(req.body, ['firstName', 'lastName','mobile','district','gsoName','gsoCode','nic',]));
                    gso._id=user._id
                    await gso.save();
                    // Commit the changes
                    await (await session).commitTransaction();
                    return  res.send(generateOutput(201,'GSO registered successfully',{'_id':user._id,'firstName':gso.firstName,'lastName':gso.lastName,'email':user.email}) );
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
    try {
        let gso = await Gso.findByIdAndRemove(req.params.id)
        let user = await UserAccount.findByIdAndRemove(req.params.id)
        res.status(200).send(generateOutput(201,'success','successfully removed'))
    } catch (error) {
        logger.error(error)
        res.status(200).send(generateOutput(500,'error','error occured while removing gso'))
    }
}

async function checkAvailabilityGSO(req,res){
    var nic = req.body.nic;
    try{
      var gso = await Gso.findOne({ "nic": nic });
      
      return res.status(200).send(generateOutput(201,'success',gso))
      
    }catch(error){
  
    }
  }


module.exports = {gsoRegister, getGsoDetails, removeGso, checkAvailabilityGSO}

