const Joi = require('joi');
const mongoose = require('mongoose');

const Order = mongoose.model('Order', new mongoose.Schema({

  category: {
    type: String,
    required: true   
  },
buyerId:{
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref: "Buyer",
    
},
  product: {
    type:mongoose.Schema.Types.ObjectId,
    required: true,
    ref:"Product"
    
  },

  amount:{
    type:Number,
    required:true,
   
  },
  totalPrice:{
    type:Number,
    required:true,
   
  },
paymentStatus:{  
     type:String,
    required:true,
   
  },
  unitPrice: {
    type: Number,
    required: true,
   
  },
  
  description:{
    type:String,
    required:true,
   
  },
  isFromBiding:{
    type:Boolean,
    required:true
  },
  orderedDate:{
    type:Date,
    default:Date.now
  },
  
  deliveryMethod:{type:String,required:true},
  paymentMethod:{type:String,required:true},
},
{
    timestamps: true,
  }));

function validateOrder(order) {
  const schema =  Joi.object({
    category: Joi.string().required(),
    amount:Joi.any().required(),
    productName: Joi.string().required(),
    totalPrice: Joi.any().required(),
    unitPrice: Joi.any().required(),
    description: Joi.string().required(),
    paymentStatus:Joi.string().required(),
    deliveryMethod:Joi.string().required(),
    paymentMethod:Joi.string().required(),
    isFromBiding:Joi.boolean().required(), 
  });
 
  return schema.validate(order);
}

exports.Order = Order; 
exports.validateOrder = validateOrder;