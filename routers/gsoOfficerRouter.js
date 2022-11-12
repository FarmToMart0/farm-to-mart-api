const express = require('express');
const myCropsController = require('../controllers/myCropController')
const router = express.Router();

router.post('/add-crop-details',myCropsController.addCropDetails) //add crop details
  
module.exports = router; 