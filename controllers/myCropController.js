const express = require("express");
const mongoose = require("mongoose");
const {
  MyCrops,
  validateHarvest,
  validate,
} = require("../models/MyCrops/index");
const _ = require("lodash");
const logger = require("../utils/logger");
const generateOutput = require("../utils/outputFactory");
const { async } = require("@firebase/util");
//function for get the ongoing crop task for specific farmer
async function getOnGoingMyCropsDetails(req, res) {
  try {
    let mycrops = await MyCrops.find({
      $and: [{ farmerNic: req.params.nic }, { status: "ongoing" }],
    }).sort({ startingDateOfGrowing: -1 });
    res.status(200).send(generateOutput(201, "success", mycrops));
  } catch (error) {
    logger.error(error);
    res
      .status(200)
      .send(
        generateOutput(
          500,
          "error",
          "error occured while getting crop  details"
        )
      );
  }
}
//function for get the completed crop task for specific farmer
async function getCompletedMyCropsDetails(req, res) {
  console.log(req.params.nic)
  try {
    let mycrops = await MyCrops.find({
      $and: [{ farmerNic: req.params.nic }, { status: "completed" }],
    }).sort({ startingDateOfGrowing: -1 });
    res.status(200).send(generateOutput(201, "success", mycrops));
  } catch (error) {
    logger.error(error);
    res
      .status(200)
      .send(
        generateOutput(
          500,
          "error",
          "error occured while getting crop  details"
        )
      );
  }
}
//function for update the ongoing crop task harvest for specific farmer
async function updateHarvest(req, res) {
  const { error } = validateHarvest(req.body);
  if (error)
    return res
      .status(200)
      .send(generateOutput(400, "validation error", error.details[0].message));
  try {
    req.body.status = "completed";
    let updatedcrop = await MyCrops.findByIdAndUpdate(
      req.params.id,
      _.pick(req.body, ["status", "harvestedAmount", "harvestedDate"])
    );
    if (!updatedcrop)
      return res
        .status(200)
        .send(
          generateOutput(
            404,
            "not found",
            "The crop with the given ID was not found."
          )
        );
    res
      .status(200)
      .send(generateOutput(201, "success fully updated", updatedcrop));
  } catch (error) {
    logger.error(error);
    return res.send(
      generateOutput(500, "error", "Error occured while updating product")
    );
  }
}

//function for getting total harvested and expected yeilds group by years
async function getHaverstedDetails(req, res) {
  var district = req.params.district;
  var cropType = req.params.crop;

  try {
    var harvestDetails = await MyCrops.aggregate([
      {
        $match: {
          $and: [
            {
              district: { $eq: district },
            },
            {
              cropType: { $eq: cropType },
            },
            { status: "completed" },
          ],
        },
      },

      {
        $group: {
          _id: { year: { $year: "$harvestedDate" } },
          totalHarvest: { $sum: "$harvestedAmount" },
          totalExpected: { $sum: "$expectedAmount" },
          totalLand: { $sum: "$landArea" },
        },
      },
    ]).sort({ "_id.year": -1 });
    return res.status(200).send(generateOutput(201, "success", harvestDetails));
  } catch (error) {
    logger.error(error);
    return res
      .status(200)
      .send(
        generateOutput(
          500,
          "success",
          "Error occured while getting harvetsted data"
        )
      );
  }
}
//getting top harvested crop details based on year and district
async function getTopHarvestedCropDetails(req, res) {
  var year = req.params.year;
  var district = req.params.district;

  try {
    var topHarvestedCrops = await MyCrops.aggregate([
      {
        $addFields: {
          stringDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$harvestedDate" },
          },
        },
      },
      {
        $match: {
          $and: [
            { stringDate: { $gte: `${year}-01-01` } },
            { stringDate: { $lt: `${year}-12-31` } },
            { district: district },
            { status: "completed" },
          ],
        }
      },
      {
        $group: {
          _id:'$cropType',
          totalLand: { $sum: "$landArea" },
          totalExpected: { $sum: "$expectedAmount" },
          totalHarvested: { $sum: "$harvestedAmount" }
        }
      },
      
     ]
    )
      .sort({ harvestedAmount: 1 })
      .limit(10);

    return res
      .status(200)
      .send(generateOutput(201, "success", topHarvestedCrops));
  } catch (error) {
    logger.error(error);
    return res
      .status(200)
      .send(
        generateOutput(
          500,
          "success",
          "Error occured while getting harvetsted data"
        )
      );
  }
}

async function getCropTypes(req, res) {
  try {
    var croptypes = await MyCrops.distinct("cropType");
    return res.status(200).send(generateOutput(201, "success", croptypes));
  } catch (error) {
    logger.error(error);
    return res
      .status(200)
      .send(
        generateOutput(
          500,
          "success",
          "Error occured while getting unique crops"
        )
      );
  }
}
async function getDistrict(req, res) {
  try {
    var district = await MyCrops.distinct("district");
    return res.status(200).send(generateOutput(201, "success", district));
  } catch (error) {
    logger.error(error);
    return res
      .status(200)
      .send(
        generateOutput(
          500,
          "success",
          "Error occured while getting unique district"
        )
      );
  }
}


async function getYearsList(req, res) {
  var district = req.params.district;
  try {
    var harvestDetails = await MyCrops.aggregate([
      {
        $match: {
          district: { $eq: district },
        },
      },

      {
        $group: {
          _id: { year: { $year: "$harvestedDate" } },
          totalLand: { $sum: "$landArea" },
        },
      },
    ]).sort({ "_id.year": -1 });
    return res.status(200).send(generateOutput(201, "success", harvestDetails));
  } catch (error) {
    logger.error(error);
    return res
      .status(200)
      .send(
        generateOutput(
          500,
          "success",
          "Error occured while getting harvetsted data"
        )
      );
  }
}
//function for getting the group by total yeilds based on categories
async function getAverageCropCategoryDetails(req, res) {
  var year = req.params.year;
  var district = req.params.district;
  try {
    var averageCategoryDetaills = await MyCrops.aggregate([
      {
        $addFields: {
          stringDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$harvestedDate" },
          },
        },
      },
      {
        $match: {
          $and: [
            {
              district: { $eq: district },
            },
            {
              status: { $eq: "completed" },
            },
            { stringDate: { $gte: `${year}-01-01` } },
            { stringDate: { $lt: `${year}-12-31` } },
          ],
        },
      },
      {
        $group: {
          _id: "$category",
          totalHarvest: { $sum: "$harvestedAmount" },
        },
      },
    ]);
    return res
      .status(200)
      .send(generateOutput(201, "success", averageCategoryDetaills));
  } catch (error) {
    logger.error(error);
    return res
      .status(200)
      .send(
        generateOutput(
          500,
          "success",
          "Error occured while getting crop category average"
        )
      );
  }
}

//fuction for add crop data
async function addCropDetails(req,res){
    console.log(req.body)
    req.body.status = 'ongoing'
    req.body.harvestedAmount = 0
    const { error } = validate(req.body);
    console.log(res)
    if (error) return res.status(400).send(generateOutput(400,'validation error',error.details[0].message));
    
    try {
        let mycrop = new MyCrops(_.pick(req.body, ['farmerNic','status','category', 'cropType', 'startingDateOfGrowing','expectingDateOfHarvest','expectedAmount','harvestedAmount','landArea','location','district']));
        console.log(mycrop)
        await mycrop.save();
        res.status(200).send(generateOutput(201,'success',mycrop));
    } catch (error) {
        logger.error(error)
        return res.status(500).send(generateOutput(500,'error','Error occured while adding crop details') );
    }
}

async function notified(req, res) {
  try {
    const notify = await MyCrops.findByIdAndUpdate(req.params.id, {
      notified: true,
    });
    res.status(200).send(generateOutput(201, "success", "notified"));
  } catch (error) {
    logger.error(error);
    return res.send(generateOutput(500, "error", "Error occured while notify"));
  }
}

async function getCropsDetails(req, res) {
  try {
    let mycrops = await MyCrops.find({ farmerNic: req.params.nic }).sort({ startingDateOfGrowing: -1 });
    res.status(200).send(generateOutput(201, "success", mycrops));
    console.log(mycrops);
  } catch (error) {
    logger.error(error);
    res
      .status(200)
      .send(
        generateOutput(
          500,
          "error",
          "error occured while getting crop  details"
        )
      );
  }
}


module.exports = {
  getOnGoingMyCropsDetails,
  updateHarvest,
  getCompletedMyCropsDetails,
  getHaverstedDetails,
  getTopHarvestedCropDetails,
  getCropTypes,
  getAverageCropCategoryDetails,
  getDistrict,
  getYearsList,
  addCropDetails,
  notified,
  getCropsDetails
};
