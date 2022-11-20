const Joi = require("joi");
const mongoose = require("mongoose");
//Schema defines for User orders
const Order = mongoose.model(
  "Order",
  new mongoose.Schema(
    {
      category: {
        type: String,
        required: true,
      },
      buyer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Buyer",
      },
      farmer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Farmer",
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },

      amount: {
        type: Number,
        required: true,
      },
      totalPrice: {
        type: Number,
        required: true,
      },
      paymentStatus: {
        type: String, //'paid or notpaid'
        required: true,
      },
      orderStatus: {
        type: String, //'pending or delivered or rejected'
        required: true,
      },
      unitPrice: {
        type: Number,
        required: true,
      },

      description: {
        type: String,
        required: true,
      },
      isFromBidding: {
        type: Boolean,
        required: true,
      },
      idReceived:{
        type: Boolean,
        required: true,
        default:false
      },
      orderedDate: {
        type: Date,
        default: Date.now,
      },

      deliveryMethod: { type: String, required: true }, //'online delivery or farm pickup'
      paymentMethod: { type: String, required: true }, //'online or cash on delivery
    },
    {
      timestamps: true,
    }
  )
);

//validation function for create order
function validateOrder(order) {
  const schema = Joi.object({
    category: Joi.string().required(),
    amount: Joi.number().required(),
    buyer: Joi.object().required(),
    farmer: Joi.object().required(),
    product: Joi.object().required(),
    totalPrice: Joi.number().required(),
    unitPrice: Joi.number().required(),
    description: Joi.string().required(),
    paymentStatus: Joi.string().required(),
    orderStatus: Joi.string().required(),
    deliveryMethod: Joi.string().required(),
    paymentMethod: Joi.string().required(),
    isFromBidding: Joi.boolean().required(),
    
  });

  return schema.validate(order);
}

exports.Orders = Order;
exports.validateOrder = validateOrder;
