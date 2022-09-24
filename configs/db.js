const mongoose = require('mongoose');

module.exports = function() {
  mongoose.connect('mongodb+srv://farm-to-mart:ANLI7F1VRlQhiy14@cluster0.8questr.mongodb.net/test')
    .then(() => console.log('Connected to MongoDB...'));
}