const Joi = require('joi');
const mongoose = require('mongoose');
const Buyer = mongoose.model('Buyer', new mongoose.Schema({

  firstName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  address:{
    type:String,
    required:true,
    minlength: 5,
    maxlength: 100
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  
  
  nic:{
    type: String,
    required: true,
    minlength: 10,
    maxlength: 13
  },

},{
  timestamps: true,
}));

function validateBuyer(buyer) {
  const schema =Joi.object( {
   
    firstName: Joi.string().min(5).max(50).required(),
    address: Joi.string().min(5).max(150).required(),
    lastName: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    nic:Joi.string().min(10).max(13).required(),
   
  });

  return schema.validate(buyer);
}

exports.Buyer = Buyer; 
exports.validateBuyer = validateBuyer;