const mongoose = require('mongoose');
//connection to database
module.exports = function() {
  mongoose.connect('mongodb+srv://farm-to-mart:ANLI7F1VRlQhiy14@cluster0.8questr.mongodb.net/FarmToMart')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err=>console.error('Could not connect to MongoDB...'))
}