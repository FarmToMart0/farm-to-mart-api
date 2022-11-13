const express = require('express');
const myCropsController = require('../controllers/myCropController')
const farmerController =require('../controllers/farmerController')
const router = express.Router();

router.post('/add-crop-details',myCropsController.addCropDetails) //add crop details
router.post('/register-farmer', farmerController.gsoRegisterFarmer); //farmer register
  
module.exports = router; 