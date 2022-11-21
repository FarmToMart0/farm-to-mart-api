const express = require('express');
const myCropsController = require('../controllers/myCropController')
const farmerController =require('../controllers/farmerController')
const router = express.Router();
const authenticate = require("../midlewares/authorization");
const gsoMidleware = require("../midlewares/gsoMidleware");


router.post('/add-crop-details',authenticate, gsoMidleware,myCropsController.addCropDetails) //add crop details
router.post('/register-farmer', authenticate, gsoMidleware, farmerController.gsoRegisterFarmer); //farmer register
router.post('/check-availability-farmer',authenticate, gsoMidleware, farmerController.checkAvailability); //check availability of farmer
router.put('/remove-farmer',authenticate, gsoMidleware, farmerController.removefarmer) //remove farmer
router.post('/user-details',authenticate, gsoMidleware, farmerController.getUserDetailsFarmer); //get user details
router.get('/get-crop-details/:nic',authenticate, gsoMidleware, myCropsController.getCropsDetails); //get crop details
  
module.exports = router; 

