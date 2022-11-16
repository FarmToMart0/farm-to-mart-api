const Joi = require('joi');
const mongoose = require('mongoose');
//Schema defines for crop task
const MyCrops = mongoose.model('MyCrops', new mongoose.Schema({
 farmerNic:{
  type:String,
  required:true
 },
 status:{
type:String,
required:true
 },
 notified:{
  type:Boolean,
  default:false
   },
  category: {
    type: String,
    required: true,
    
  },
  cropType: {
    type: String,
    required: true,
    
  },
  startingDateOfGrowing:{
    type:Date,
    required:true,
   
  },
  expectingDateOfHarvest:{
    type:Date,
    required:true,
   
  },
  harvestedDate:{
    type:Date,
    required:true,
    
  },
  expectedAmount:{

  },
  harvestedAmount:{
    type:Number,
    
   
  },
  landArea: {
    type: Number,
    required: true,
   
  },
  location:{
    type:String,
    required:true
  },
  district:{
    type:String,
    required:true
  }
  
    

},
{
  timestamps: true,
}));
//validation function for create cropdetails
function validateMyCrops(cropdetails) {
  const schema =  Joi.object({
    farmerNic:Joi.string().required(),
    category: Joi.string().required(),
    status:Joi.string().required(),
    cropType:Joi.string().required(),
    startingDateOfGrowing: Joi.date().required(),
    expectingDateOfHarvest: Joi.date().required(),
    harvestedDate:Joi.date().required(),
    expectedAmount:Joi.number().required(),
    harvestedAmount: Joi.number().required(),
    landArea: Joi.number().required(),
    location:Joi.string().required(),
    district:Joi.string().required()
  });
 
  return schema.validate(cropdetails);
}

//validation function for update crop details
function validateHarvest(harvestDetails) {
    const schema =  Joi.object({
       
        harvestedDate:Joi.date().required(),
        harvestedAmount: Joi.number().required()
      });
     
      return schema.validate(harvestDetails);
}

exports.MyCrops = MyCrops; 
exports.validate = validateMyCrops;
exports.validateHarvest = validateHarvest;