
const express = require('express');
const farmerController =require('../controllers/farmerController')
const myCropsController = require('../controllers/myCropController')
const router = express.Router();
//router for the farmer register
router.post('/register',farmerController.farmerRegister );
//router for the getting ongoing crop details
router.get('/getmycrops/:nic',myCropsController.getOnGoingMyCropsDetails)
//router for the getting completed crop task for certain farmer
router.get('/getcompletedmycrops/:nic',myCropsController.getCompletedMyCropsDetails)
////router for the update crop task for certain farmer
router.put('/updateharvest/:id',myCropsController.updateHarvest)
  
module.exports = router; 