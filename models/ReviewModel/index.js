const Joi = require('joi');
const mongoose = require('mongoose');
//Schema defines for User Reviews
const Review = mongoose.model('Review', new mongoose.Schema({

  
buyer:{
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref: "Buyer",
    
},
farmer:{
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref: "Farmer",
    
},

  comment:{
    type:String,
    required:true,
   
  },
  rating:{
    type:Number,
    required:true,
   
  },
  
  commentedDate:{
    type:Date,
    default:Date.now
  }
},
{
    timestamps: true,
  }));


  //validation function for create Review
function validateReview(review) {
  const schema =  Joi.object({
    buyer:Joi.object().required(),
    farmer:Joi.object().required(),
    comment: Joi.string().required(),
    rating:Joi.number().required()
  });
 
  return schema.validate(review);
}

exports.Review = Review; 
exports.validateReview = validateReview;