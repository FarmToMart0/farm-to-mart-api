
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
//Schema defines for User accounts
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  userRole :{
    type:String,
    required:true,
    
  }
},
{
  timestamps: true,
}
);
//methos for genaration token
userSchema.methods.generateAuthToken =(data)=> { 
  const token = jwt.sign({ id: data?._id, userRole: data?.userRole }, 'jwtPrivateKey',{
    expiresIn: '1d' 

});
  return token;
}

const UserAccount = mongoose.model('UserAccount', userSchema);
//validate the user account
function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(user);
}



exports.UserAccount = UserAccount; 
exports.validateUser = validateUser;