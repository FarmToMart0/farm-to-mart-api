const express = require('express');
const mongoose = require('mongoose');
const {MyCrops,validateHarvest, validate} = require('../models/MyCrops/index');
const _ = require('lodash');
const logger = require("../utils/logger");
const generateOutput= require('../utils/outputFactory')

async function getOnGoingMyCropsDetails(req,res) {
    try {
        let mycrops = await MyCrops.find({ $and: [ { 'farmerNic':req.params.nic}, { 'status':'ongoing' } ] }).sort({'startingDateOfGrowing':-1})
        res.status(200).send(generateOutput(201,'success',mycrops))
    } catch (error) {
        logger.error(error)
        res.status(200).send(generateOutput(500,'error','error occured while getting crop  details'))
    }
    
}
async function getCompletedMyCropsDetails(req,res) {
    try {
        let mycrops = await MyCrops.find({ $and: [ { 'farmerNic':req.params.nic}, { 'status':'completed' } ] }).sort({'startingDateOfGrowing':-1})
        res.status(200).send(generateOutput(201,'success',mycrops))
    } catch (error) {
        logger.error(error)
        res.status(200).send(generateOutput(500,'error','error occured while getting crop  details'))
    }
    
}
async  function updateHarvest(req,res) {
    console.log(req.body)
    
    const { error } = validateHarvest(req.body); 
    if (error) return res.status(200).send(generateOutput(400,'validation error',error.details[0].message));
    try {
        req.body.status='completed'
        let updatedcrop = await MyCrops.findByIdAndUpdate(req.params.id,_.pick(req.body, ['status', 'harvestedAmount','harvestedDate']))
        if (!updatedcrop) return res.status(200).send(generateOutput(404,'not found','The crop with the given ID was not found.'));
        res.status(200).send(generateOutput(201,'success fully updated',updatedcrop));
    } catch (error) {
        logger.error(error)
        return res.send(generateOutput(500,'error','Error occured while updating product') );
    }
}

async function addCropDetails(req,res){
    console.log(req.body)
    const { error } = validate(req.body);
    if (error) return res.status(200).send(generateOutput(400,'validation error',error.details[0].message));
    try {
        let mycrop = new MyCrops(_.pick(req.body, ['farmerNic','status','category', 'cropType', 'startingDateOfGrowing','expectingDateOfHarvest','harvestedDate','expectedAmount','harvestedAmount','landArea','location','district']));
        await mycrop.save();
        res.status(200).send(generateOutput(201,'success',mycrop));
    } catch (error) {
        logger.error(error)
        return res.send(generateOutput(500,'error','Error occured while adding crop details') );
    }


}
module.exports ={getOnGoingMyCropsDetails,updateHarvest,getCompletedMyCropsDetails,addCropDetails}