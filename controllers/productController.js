const express = require("express");
const mongoose = require("mongoose");
const { Product, validate } = require("../models/ProductModel/index");
const { Farmers } = require("../models/FarmerModel/index");
const _ = require("lodash");
const logger = require("../utils/logger");
const generateOutput = require("../utils/outputFactory");
const { arrangeMarket } = require("../services/marketProduct");

// =====================Get all products for market
async function marketProduct(req, res) {
	const district = req.query.district;
	const type = req.query.type;
  console.log("district"+district)
  console.log("type"+type)
	
	try {
		const data = await Product.aggregate([
      {
        $lookup: {
          from: "farmers",
          localField: "farmer",
          foreignField: "_id",
          as: "FarmerProducts",
        },
      },
    ]);

    const returnArray =  arrangeMarket(data).filter((element)=>{
      if(element.district === district && element.category === type){
        return true
      }else{
        return false
      }
    })

		res
			.status(200)
			.send(generateOutput(201, "success", returnArray));
	} catch (error) {
		logger.error(error);
		res
			.status(200)
			.send(
				generateOutput(
					500,
					"error",
					"error occured while getting products details"
				)
			);
	}
}

//function for add product
async function addProduct(req, res) {
	var ObjectId = mongoose.ObjectId;
	req.body.remainQuantity = req.body.quantity;
	console.log(req.body);
	const { error } = validate({
		farmer: ObjectId(req.body.farmer),
		category: req.body.category,
		biddingEndin: req.body.biddingEndin,
		remainQuantity: req.body.remainQuantity,
		productName: req.body.productName,
		quantity: req.body.quantity,
		unitPrice: req.body.unitPrice,
		description: req.body.description,
		initialBid: req.body.initialBid,
		deliveryOption: req.body.deliveryOption,
		paymentOption: req.body.paymentOption,
		biddingEnable: req.body.biddingEnable,
	});
	if (error) {
		const output = generateOutput(
			400,
			"validate error",
			error.details[0].message
		);
		return res.status(200).send(output);
	}
	try {
		let product = new Product(req.body);
		await product.save();
		return res.send(
			generateOutput(201, "success", "Product added successfully")
		);
	} catch (error) {
		logger.error(error);
		return res.send(
			generateOutput(500, "error", "Error occured while added product")
		);
	}
}
//function for get the product
async function getProduct(req, res) {
	try {
		let productList = await Product.find().sort({
			remainQuantity: -1,
			date: 1,
		});
		res.status(200).send(generateOutput(201, "success", productList));
	} catch (error) {
		logger.error(error);
		res
			.status(200)
			.send(
				generateOutput(
					500,
					"error",
					"error occured while getting products details"
				)
			);
	}
}

//function for delete the product
async function deleteProduct(req, res) {
	try {
		let product = await Product.findByIdAndRemove(req.params.id);
		res
			.status(200)
			.send(generateOutput(201, "success", "successfully removed"));
	} catch (error) {
		loggererror(error);
		res
			.status(200)
			.send(
				generateOutput(
					500,
					"error",
					"error occured while removing products details"
				)
			);
	}
}

//function for update the product
async function updateProduct(req, res) {
	var ObjectId = mongoose.ObjectId;
	req.body.remainQuantity = req.body.quantity;

	const { error } = validate({
		category: req.body.category,
		farmer: ObjectId(req.body.farmer),
		biddingEndin: req.body.biddingEndin,
		remainQuantity: req.body.remainQuantity,
		productName: req.body.productName,
		quantity: req.body.quantity,
		unitPrice: req.body.unitPrice,
		description: req.body.description,
		initialBid: req.body.initialBid,
		deliveryOption: req.body.deliveryOption,
		paymentOption: req.body.paymentOption,
		biddingEnable: req.body.biddingEnable,
	});
	if (error)
		return res
			.status(200)
			.send(generateOutput(400, "validation error", error.details[0].message));
	try {
		const product = await Product.findByIdAndUpdate(req.body._id, req.body);

		if (!product)
			return res
				.status(200)
				.send(
					generateOutput(
						404,
						"not found",
						"The product with the given ID was not found."
					)
				);

		res.status(200).send(generateOutput(201, "success fully updated", product));
	} catch (error) {
		logger.error(error);
		return res.send(
			generateOutput(500, "error", "Error occured while updating product")
		);
	}
}

//endpoint for getting images for buy item
async function getImage(req, res) {
	const id = req.params.id;

	try {
		let output = await Product.findOne({ _id: id });

		let images = output.images.map((el) => {
			return { img: el };
		});
		res.send({ data: images });
	} catch (err) {
		logger.error(err);
		res
			.status(200)
			.send(
				generateOutput(
					500,
					"error",
					"error occured while getting images from DB"
				)
			);
	}
}

//function for getting total no of ongoing bidding
async function getTotalOnGoingBids(req, res) {
	var id = req.params.id;
	var ObjectId = mongoose.ObjectId;
	try {
		var biddingCount = await Product.aggregate([
			{
				$match: {
					$and: [
						{
							farmer: { $eq: new ObjectId(id) },
						},
						{ biddingEnable: { $eq: true } },
					],
				},
			},

			{
				$count: "farmer",
			},
		]);
		info("total ongoing bidding count successfully fetched");
		res.status(200).send(generateOutput("201", "success", biddingCount));
	} catch (error) {
		logger.error(error);
		return res.send(
			generateOutput(
				500,
				"error",
				"Error occured while getting ongoing bidding count"
			)
		);
	}
}

module.exports = {
	marketProduct,
	getTotalOnGoingBids,
	deleteProduct,
	addProduct,
	getImage,
	getProduct,
	getTotalOnGoingBids,
	updateProduct,
};
