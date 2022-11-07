const Joi = require('joi');
const mongoose = require('mongoose');
//Schema defines for products
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

},
{
  timestamps: true,
}));
//validation function for create product
function validateProduct(product) {
  const schema =  Joi.object({
    category: Joi.string().required(),
    remainQuantity:Joi.any().required(),
    productName: Joi.string().required(),
    quantity: Joi.any().required(),
    unitPrice: Joi.any().required(),
    description: Joi.string().required(),
    initialBid:Joi.any().required(),
    deliveryOption:Joi.array().items(Joi.string()).min(1).required(),
    paymentOption:Joi.array().items(Joi.string()).min(1).required(),
    biddingEnable:Joi.boolean().required(),
   
  });
 
  return schema.validate(product);
}

exports.Product = Product; 
exports.validate = validateProduct;