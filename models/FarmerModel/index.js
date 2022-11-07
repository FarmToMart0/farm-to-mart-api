const Joi = require('joi');
const mongoose = require('mongoose');

const Farmer = mongoose.model('Farmer', new mongoose.Schema({

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
  district:{
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  gsdName:{
    type: String,
    required: true,
    
  },
  gsdCode:{
    type: String,
    required: true,
    
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

function validateFarmer(farmer) {
  const schema =Joi.object( {
    firstName: Joi.string().min(5).max(50).required(),
    address: Joi.string().min(5).max(150).required(),
    lastName: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    district:Joi.string().required(),
    gsdName:Joi.string().required(),
    gsdCode:Joi.string().required(),
    nic:Joi.string().min(10).max(13).required()
  });

  return schema.validate(farmer);
}

exports.Farmer = Farmer; 
exports.validate = validateFarmer;