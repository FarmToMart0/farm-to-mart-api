const express = require('express');
const myCropsController = require('../controllers/myCropController')
const farmerController =require('../controllers/farmerController')
const router = express.Router();

router.post('/add-crop-details',myCropsController.addCropDetails) //add crop details
router.post('/register-farmer', farmerController.gsoRegisterFarmer); //farmer register
router.post('/check-availability-farmer',farmerController.checkAvailability); //check availability of farmer
router.put('/remove-farmer',farmerController.removefarmer) //remove farmer
router.post('/user-details', farmerController.getUserDetailsFarmer); //get user details
  
module.exports = router; 