const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
//Schema defines for User accounts
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "UserAccount",
    },
    token: {
      type: String,
      required: true,
    },
    status:{
       type:Boolean,
       default:false 
    }
    
  },
  {
    timestamps: true,
  }
);
//methos for genaration token


const ResetPassword = mongoose.model("ResetPassword", userSchema);
//validate the user account
function validateResetPassword(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    userId: Joi.string().min(5).max(1024).required(),
    token:Joi.string().required()
  });

  return schema.validate(user);
}

exports.ResetPassword = ResetPassword;
exports.validateReset = validateResetPassword;
