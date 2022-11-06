
const express = require('express');
const farmerController =require('../controllers/farmerController')
const myCropsController = require('../controllers/myCropController')
const router = express.Router();

router.post('/register',farmerController.farmerRegister );
router.get('/getmycrops/:nic',myCropsController.getOnGoingMyCropsDetails)
router.get('/getcompletedmycrops/:nic',myCropsController.getCompletedMyCropsDetails)
router.put('/updateharvest/:id',myCropsController.updateHarvest)
  
module.exports = router; 