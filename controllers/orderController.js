const express = require('express');
const mongoose = require('mongoose');
const {Orders,validateOrder} =require('../models/OrderModel/index');
const _ = require('lodash');
const logger = require("../utils/logger");
const generateOutput= require('../utils/outputFactory');
//get pending orders that specific to some certain farmer
async function getAllOrders(req,res) {
    try {
        
        let orders = await Orders.find( { 'farmer':req.params.id})
            .sort({'orderedDate':-1})
            .populate("farmer")
            .populate("buyer")
            .populate("product")
            .exec();
            logger.info("orders successfully fetched")
            res.status(200).send(generateOutput("201","success",orders))   
    } catch (error) {
        logger.error(error)
        res.status(200).send(generateOutput("500","error","error occured while fetching order details"))
    }
}
//get delivered orders that specific to some certain farmer
async function getDeliveredOrders(req,res) {
    try {
        
        let orders = await Orders.find({ $and: [ { 'farmer':req.params.id}, { 'orderStatus':'delivered' } ] })
            .sort({'orderedDate':-1})
            .populate("farmer")
            .populate("buyer")
            .populate("product")
            .exec();
            logger.info("orders successfully fetched")
            res.status(200).send(generateOutput("201","success",orders))   
    } catch (error) {
        logger.error(error)
        res.status(200).send(generateOutput("500","error","error occured while fetching order details"))
    }
}
//get rejected orders that specific to some certain farmer
async function getRejectedOrders(req,res) {
    try {
        
        let orders = await Orders.find({ $and: [ { 'farmer':req.params.id}, { 'orderStatus':'rejected' } ] })
            .sort({'orderedDate':-1})
            .populate("farmer")
            .populate("buyer")
            .populate("product")
            .exec();
            logger.info("orders successfully fetched")
            res.status(200).send(generateOutput("201","success",orders))   
    } catch (error) {
        logger.error(error)
        res.status(200).send(generateOutput("500","error","error occured while fetching order details"))
    }
}

//function for update the payment details
async function markAsPaid(req,res) {
    try {
        let updatedorder = await Orders.findByIdAndUpdate(req.params.id,{paymentStatus:"paid"})
        if (!updatedorder) return res.status(200).send(generateOutput(404,'not found','The order with the given ID was not found.'));
        res.status(200).send(generateOutput(201,'payment status  successfully updated',updatedorder));
    } catch (error) {
        logger.error(error)
        res.status(200).send(generateOutput("500","error","error occured while updating order paymet details"))
    }   
}
//function for update the delivery status
async function markAsDelivered(req,res) {
    try {
        let updatedorder = await Orders.findByIdAndUpdate(req.params.id,{orderStatus:"delivered"})
       
        if (!updatedorder) return res.status(200).send(generateOutput(404,'not found','The order with the given ID was not found.'));
        res.status(200).send(generateOutput(201,'Delivery status successfully updated',updatedorder));
    } catch (error) {
        logger.error(error)
        res.status(200).send(generateOutput("500","error","error occured while updating order delivery status"))
    }  
}
//function for update the rejected status

async function markAsRejected(req,res) {
    try {
        
        let updatedorder = await Orders.findByIdAndUpdate(req.params.id,{orderStatus:"rejected"})
        
        if (!updatedorder) return res.status(200).send(generateOutput(404,'not found','The order with the given ID was not found.'));
        res.status(200).send(generateOutput(201,'order successfully rejected',updatedorder));
    } catch (error) {
        logger.error(error)
        res.status(200).send(generateOutput("500","error","error occured while updating order rejected details"))
    }    
}
async function unDoRejectedOrder(req,res) {
    try {
        let updatedorder = await Orders.findByIdAndUpdate(req.params.id,{orderStatus:"place"})
        if (!updatedorder) return res.status(200).send(generateOutput(404,'not found','The order with the given ID was not found.'));
        res.status(200).send(generateOutput(201,'order successfully updated',updatedorder));
    } catch (error) {
        logger.error(error)
        res.status(200).send(generateOutput("500","error","error occured while undo  rejected order"))
    }   
}
module.exports ={getAllOrders,getDeliveredOrders,getRejectedOrders,markAsPaid,markAsDelivered,markAsRejected,unDoRejectedOrder}
