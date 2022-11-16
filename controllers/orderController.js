const express = require('express');
const mongoose = require('mongoose');
const {Orders,validateOrder} =require('../models/OrderModel/index');
const _ = require('lodash');
const logger = require("../utils/logger");
const generateOutput= require('../utils/outputFactory');
const { Product } = require('../models/ProductModel');
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

async function getTotalSales(req,res) {
    var id = req.params.id;
    var ObjectId = mongoose.Types.ObjectId;
    console.log(id)
    try {
        var totalSales = await Orders.aggregate([
            {$match:{$and: [
                {
                    farmer:{$eq:new ObjectId(id)}
                },
                {paymentStatus:{$eq:'paid'}}
              ],
              }
            },
             
            {$group:{
                _id: "$farmer" ,
                totalSales: { $sum: "$totalPrice" },  
            },  
            },
           ])
        logger.info("total sales successfully fetched")
        res.status(200).send(generateOutput("201","success",totalSales))   
    } catch (error) {
        logger.error(error)
        res.status(200).send(generateOutput("500","error","error occured while getting total sales"))
    }
}



async function getTotalSalesInLastMonth(req,res) {
    var id = req.params.id;
    var date = new Date();
    var ObjectId = mongoose.Types.ObjectId;
    console.log(id)
    try {
        var totalSales = await Orders.aggregate([
            {$addFields: {
                "month": {
                  $month: {
                    $toDate: "$orderedDate"
                  }
                }
              }},
            {$match:{$and: [
                {
                    month:{$gte:date.getMonth()}
                },
                {
                    farmer:{$eq:new ObjectId(id)}
                },
                {paymentStatus:{$eq:'paid'}}
              ],
              }
            },
             
            {$group:{
                _id: "$farmer" ,
                totalSales: { $sum: "$totalPrice" },  
            },  
            },
           ])
        logger.info("total sales successfully fetched")
        res.status(200).send(generateOutput("201","success",totalSales))   
    } catch (error) {
        logger.error(error)
        res.status(200).send(generateOutput("500","error","error occured while getting total sales since last month"))
    }
}
async function getTotalOrders(req,res) {
    var id = req.params.id;
    var ObjectId = mongoose.Types.ObjectId;
    console.log(id)
    try {
        var ordersCount = await Orders.aggregate([
            
            {$match:{
                    farmer:{$eq:new ObjectId(id)}
              }
            },
             
            {$count:'farmer'
            },
           ])
        logger.info("total orders count successfully fetched")
        res.status(200).send(generateOutput("201","success",ordersCount))   
    } catch (error) {
        logger.error(error)
        res.status(200).send(generateOutput("500","error","error occured while getting total orders count"))
    }
}

async function getTotalOrdersCountInLastMonth(req,res) {
    var id = req.params.id;
    var date = new Date();
    var ObjectId = mongoose.Types.ObjectId;
    console.log(id)
    try {
        var totalOrdersCount = await Orders.aggregate([
            {$addFields: {
                "month": {
                  $month: {
                    $toDate: "$orderedDate"
                  }
                }
              }},
            {$match:{$and: [
                {
                    month:{$gte:date.getMonth()}
                },
                {
                    farmer:{$eq:new ObjectId(id)}
                },
                
              ],
              }
            },
             
            {$count:'farmer'
            },
           ])
        logger.info("total sales successfully fetched")
        res.status(200).send(generateOutput("201","success",totalOrdersCount))   
    } catch (error) {
        logger.error(error)
        res.status(200).send(generateOutput("500","error","error occured while getting total sales since last month"))
    }
}
async function getTotalPendingOrdersCount(req,res) {
    var id = req.params.id;
   
    var ObjectId = mongoose.Types.ObjectId;
   
    try {
        var totalOrdersCount = await Orders.aggregate([
            
            {$match:{$and: [
                
                {
                    farmer:{$eq:new ObjectId(id)}
                },
                {
                    orderStatus:{$eq:'place'}
                },
                
              ],
              }
            },
             
            {$count:'farmer'
            },
           ])
        logger.info("total sales successfully fetched")
        res.status(200).send(generateOutput("201","success",totalOrdersCount))   
    } catch (error) {
        logger.error(error)
        res.status(200).send(generateOutput("500","error","error occured while getting total sales since last month"))
    }
}
async function getSalesOverview(req,res) {
    var id = req.params.id;
    var sixMonths = (1.577e+10)*2;
    var date = new Date();
    var sub =date-sixMonths;
    console.log(sub);
    var ObjectId = mongoose.Types.ObjectId;
    try {
        var sales = await Orders.aggregate([
         
            {$match:{$and: [
                {
                    farmer:{$eq:new ObjectId(id)}
                },
                {
                    paymentStatus:{$eq:'paid'}
                },
                {
                    orderedDate:{$gte:new Date(sub)}
                },
                
              ],
              }},
              
             
            {$group:{
                _id: {month:{ $month: "$orderedDate" }},
                totalSales: { $sum: "$totalPrice" },
                
            },
            
        },
        
        ]).sort({'_id.month':1})
        return res.status(200).send(generateOutput(201,"success",sales))
    } catch (error) {
        
    }
}
async function getOrderOverview(req,res) {
    
    var id = req.params.id;
    var ObjectId = mongoose.Types.ObjectId;
    try {
        var ordersOverview = await Orders.aggregate([
          
            {$match: {farmer:{$eq:new ObjectId(id)}}},
            {$group : {_id : "$product", totalAmount : { $sum : "$amount"}}},
            {
                $lookup: {
                    "from": "products",
                    "localField": "_id",
                    "foreignField": "_id",
                    "as": "details"
                }
            },
            
            
    ])
        return res.status(200).send(generateOutput(201,"success",ordersOverview))
    } catch (error) {
        logger.error(error);
        return res.status(200).send(generateOutput(201,"error",error))
    }
}
module.exports ={getAllOrders,getDeliveredOrders,getRejectedOrders,markAsPaid,
    markAsDelivered,markAsRejected,unDoRejectedOrder,getTotalSales,getTotalSalesInLastMonth,getTotalOrders,getTotalOrdersCountInLastMonth,
    getTotalPendingOrdersCount,getSalesOverview,getOrderOverview}
