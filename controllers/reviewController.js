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

async function addReviews(req,res){
  var ObjectId = mongoose.Types.ObjectId;
  const {error} = validateReview({
    buyer: new ObjectId(req.body.buyer),
    farmer: new ObjectId(req.body.farmer),
    comment: req.body.comment,
    rating: req.body.rating,
  })
  console.log("came here");
  if (error) {
		const output = generateOutput(
			400,
			"validate error",
			error.details[0].message
		);
		return res.status(200).send(output);
	}
	try {
		let review = new Review(req.body);
		await review.save();
		return res.send(
			generateOutput(201, "success", "Review added successfully")
		);
	} catch (error) {
		logger.error(error);
		return res.send(
			generateOutput(500, "error", "Error occured while adding review")
		);
	}
}

module.exports = { getReviews,addReviews };
