const express = require("express");
const mongoose = require("mongoose");
const { Review, validateReview } = require("../models/ReviewModel/index");
const _ = require("lodash");
const logger = require("../utils/logger");
const generateOutput = require("../utils/outputFactory");

async function getReviews(req, res) {
  var ObjectId = mongoose.Types.ObjectId;
  var id = req.params.id;
  try {
    var review = await Review.find({ farmer: ObjectId(req.params.id) })
      .sort({ commentedDate: -1 })
      .populate("farmer")
      .populate("buyer")
      .exec();
    logger.info("orders successfully fetched");
    res.status(200).send(generateOutput("201", "success", review));
  } catch (error) {}
}

module.exports = { getReviews };
