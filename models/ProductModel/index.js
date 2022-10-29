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
  unitPrice: {
    type: Number,
    required: true,
   
  },
  initialBid:{
    type: Number,
    required: true,
    
  },
  deliveryOption:{
    type: Array,
    required: true,
    
  },
  paymentOption:{
    type: String,
    required: true,
    
  },
  biddingEnable:{
    type: String,
    required: true,
    minlength: 10,
    maxlength: 13
  },
  images:{
    type: String,
    required: true,
    minlength: 10,
    maxlength: 13
  },

}));

function validateFarmer(farmer) {
  const schema = {
   
    firstName: Joi.string().min(5).max(50).required(),
    address: Joi.string().min(5).max(150).required(),
    lastName: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    district:Joi.string().required(),
    gsdName:Joi.string().required(),
    gsdCode:Joi.string().required(),
    nic:Joi.string().min(10).max(13).required(),
   
  };

  return Joi.valid(farmer, schema);
}

exports.Farmer = Farmer; 
exports.validate = validateFarmer;