const Joi = require('joi');
const mongoose = require('mongoose');

const Product = mongoose.model('Product', new mongoose.Schema({

  category: {
    type: String,
    required: true,
    
  },
  productName: {
    type: String,
    required: true,
    
  },
  quantity:{
    type:Number,
    required:true,
   
  },
  remainQuantity:{
    type:Number,
    required:true,
   
  },
  date: { type: Date, default: Date.now },
  description:{
    type:String,
    required:true,
   
  },
  unitPrice: {
    type: Number,
    required: true,
   
  },
  initialBid:{
    type: Number,
    required: true,
    
  },
  deliveryOption:[{type:String,required:true}],
  paymentOption:[{type:String,required:true}],
  biddingEnable:{
    type: Boolean,
    required: true,
   
  },
  
  images:[{type:String,required:true}],

}));

function validateProduct(product) {
  const schema = {
    category: Joi.string().required(),
    remainQuantity:Joi.string().required(),
    productName: Joi.string().required(),
    quantity: Joi.string().required(),
    unitPrice: Joi.string().required(),
    description: Joi.string().required(),
    initialBid:Joi.string().required(),
    deliveryOption:Joi.array().required,
    paymentOption:Joi.array().required(),
    biddingEnable:Joi.array().required(),
   
  };

  return Joi.valid(product, schema);
}

exports.Product = Product; 
exports.validate = validateProduct;