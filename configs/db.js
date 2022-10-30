const mongoose = require('mongoose');
const logger = require("../utils/logger");
//connection to database
module.exports = function() {
  mongoose.connect('mongodb+srv://farm-to-mart:eLHmnVHPCtOq5mQm@cluster0.8questr.mongodb.net/FarmToMart')
    .then(() => logger.info('Connected to MongoDB...'))
    .catch(err=>logger.error('Could not connect to MongoDB...'))
}