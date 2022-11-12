
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
//router for gettting the harvest amount details
router.get('/harvestdetails/:district/:crop',myCropsController.getHaverstedDetails);
//router for getting top harveted crops in some district in some year
router.get('/topharvestedcrops/:district/:year',myCropsController.getTopHarvestedCropDetails);
//router for getting unique crop names
router.get('/uniquecrops',myCropsController.getCropTypes);
//router for getting crop category average
router.get('/averagecropcategory/:district/:year',myCropsController.getAverageCropCategoryDetails);
module.exports = router; 