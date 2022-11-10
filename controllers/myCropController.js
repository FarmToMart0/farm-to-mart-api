const express = require('express');
const mongoose = require('mongoose');
const {MyCrops,validateHarvest} = require('../models/MyCrops/index');
const _ = require('lodash');
const logger = require("../utils/logger");
const generateOutput= require('../utils/outputFactory')
//function for get the ongoing crop task for specific farmer
async function getOnGoingMyCropsDetails(req,res) {
    try {
        let mycrops = await MyCrops.find({ $and: [ { 'farmerNic':req.params.nic}, { 'status':'ongoing' } ] }).sort({'startingDateOfGrowing':-1})
        res.status(200).send(generateOutput(201,'success',mycrops))
    } catch (error) {
        logger.error(error)
        res.status(200).send(generateOutput(500,'error','error occured while getting crop  details'))
    }
    
}
//function for get the completed crop task for specific farmer
async function getCompletedMyCropsDetails(req,res) {
    try {
        let mycrops = await MyCrops.find({ $and: [ { 'farmerNic':req.params.nic}, { 'status':'completed' } ] }).sort({'startingDateOfGrowing':-1})
        res.status(200).send(generateOutput(201,'success',mycrops))
    } catch (error) {
        logger.error(error)
        res.status(200).send(generateOutput(500,'error','error occured while getting crop  details'))
    }
    
}
//function for update the ongoing crop task harvest for specific farmer
async  function updateHarvest(req,res) {
    
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

//function for getting total harvested and expected yeilds group by years 
async function getHaverstedDetails(req,res) {
    var district  = req.params.district;
    var cropType  = req.params.crop;
    try {
        var harvestDetails = await MyCrops.aggregate([
            {$match: {district:{$eq:district}, cropType:{$eq:cropType}}},
            {$group:{
                _id: { year: { $year: "$harvestedDate" }},
                totalHarvest: { $sum: "$harvestedAmount" },
                totalExpected: { $sum: "$expectedAmount" },
                totalLand:{ $sum: "$landArea" }
            }
        }
        ])
        return res.status(200).send(generateOutput(201,"success",harvestDetails))
    } catch (error) {
        logger.error(error)
        return res.status(200).send(generateOutput(500,"success","Error occured while getting harvetsted data"))
    }
    
}
//getting top harvested crop details based on year and district
async  function  getTopHarvestedCropDetails(req,res) {
    var year = req.params.year;
    var district = req.params.district;

    try {
        var topHarvestedCrops = await MyCrops.find({ $and: [ 
                                                            { "$expr": { "$eq": [{ "$year": "$harvestedDate" }, year] } },
                                                             { 'district':district },{'status':'completed'}
                                                           ]  },
                                                   {'category':1,'cropType':1,'harvestedAmount':1,'expectedAmount':1,'landArea':1})
                                             .sort({'harvestedAmount':1})
                                             .limit(10); 
                                                    
                                                    
                                                  
        return res.status(200).send(generateOutput(201,"success",topHarvestedCrops))
    } catch (error) {
        logger.error(error)
        return res.status(200).send(generateOutput(500,"success","Error occured while getting harvetsted data"))
    }
}
module.exports ={getOnGoingMyCropsDetails,updateHarvest,getCompletedMyCropsDetails,getHaverstedDetails,getTopHarvestedCropDetails}