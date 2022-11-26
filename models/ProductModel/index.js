const Joi = require("joi");
const mongoose = require("mongoose");
//Schema defines for products
const Product = mongoose.model(
  "Product",
  new mongoose.Schema(
    {
      category: {
        type: String,
        required: true,
      },
      productName: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      farmer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Farmer",
      },
      remainQuantity: {
        type: Number,
        required: true,
      },
      date: { type: Date, default: Date.now },
      biddingEndin: { type: Date },
      description: {
        type: String,
        required: true,
      },
      unitPrice: {
        type: Number,
     
      },
      initialBid: {
        type: Number,
        
      },
      
      isRemoved: {
        type:Boolean,
        default:false
        
      },
      deliveryOption: [{ type: String, required: true }],
      paymentOption: [{ type: String, required: true }],
      biddingEnable: {
        type: Boolean,
      },

      images: [{ type: String, required: true }],
    },
    {
      timestamps: true,
    }
  )
);
//validation function for create product
function validateProduct(product) {
  const schema = Joi.object({
    category: Joi.string().required(),
    remainQuantity: Joi.any().required(),
    productName: Joi.string().required(),
    quantity: Joi.any().required(),
    unitPrice: Joi.any(),
    farmer: Joi.object().required(),
    biddingEndin: Joi.any(),
    description: Joi.string().required(),
    initialBid: Joi.any(),
    deliveryOption: Joi.array().items(Joi.string()).min(1).required(),
    paymentOption: Joi.array().items(Joi.string()).min(1).required(),
    biddingEnable: Joi.boolean(),
  });

  return schema.validate(product);
}

exports.Product = Product;
exports.validate = validateProduct;
