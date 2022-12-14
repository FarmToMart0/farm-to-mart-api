const Joi = require("joi");
const mongoose = require("mongoose");

const GSO = mongoose.model(
  "GSO",
  new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    mobile: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    district: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    gsdName: {
      type: String,
      required: true,
    },
    gsdCode: {
      type: String,
      required: true,
    },
    nic: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 13,
    },
  })
); // This is the model

function validateGso(gso) {
  const shema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    mobile: Joi.string().min(10).max(50).required(),
    district: Joi.string().min(5).max(50).required(),
    gsdName: Joi.string().required(),
    gsdCode: Joi.string().required(),
    nic: Joi.string().min(10).max(13).required(),
  });
  return shema.validate(gso);
}

function validateUpdate(updatedgso) {
  const schema = Joi.object ({
    _id: Joi.string(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    mobile: Joi.string().min(10).max(50).required(),
  })
  return schema.validate(updatedgso)
}

exports.Gso = GSO;
exports.validate = validateGso;
exports.validateUpdate = validateUpdate;
