const express = require("express");
const farmerController = require("../controllers/farmerController");
const myCropsController = require("../controllers/myCropController");
//midlewares for authentication
const authenticate = require("../midlewares/authorization");
//midlewares for checked user types
const farmerMidleware = require("../midlewares/farmerMidleware");
const router = express.Router();
//router for the farmer register
router.post("/register", farmerController.farmerRegister);
//router for the getting ongoing crop details
router.get(
  "/getmycrops/:nic",
  authenticate,
  farmerMidleware,
  myCropsController.getOnGoingMyCropsDetails
);
//router for the getting completed crop task for certain farmer
router.get(
  "/getcompletedmycrops/:nic",
  authenticate,
  farmerMidleware,
  myCropsController.getCompletedMyCropsDetails
);
////router for the update crop task for certain farmer
router.put(
  "/updateharvest/:id",
  authenticate,
  farmerMidleware,
  myCropsController.updateHarvest
);
//router for gettting the harvest amount details
router.get(
  "/harvestdetails/:district/:crop",
  authenticate,
  farmerMidleware,
  myCropsController.getHaverstedDetails
);
//router for getting top harveted crops in some district in some year
router.get(
  "/topharvestedcrops/:district/:year",
  authenticate,
  farmerMidleware,
  myCropsController.getTopHarvestedCropDetails
);
//router for getting unique crop names
router.get(
  "/uniquecrops",
  authenticate,
  farmerMidleware,
  myCropsController.getCropTypes
);
//router for getting crop category average
router.get(
  "/averagecropcategory/:district/:year",
  authenticate,
  farmerMidleware,
  myCropsController.getAverageCropCategoryDetails
);
//router for getting unique district names
router.get(
  "/uniquedistrict",
  authenticate,
  farmerMidleware,
  myCropsController.getDistrict
);
//router for getting unique years list
router.get(
  "/uniqueyears/:district",
  authenticate,
  farmerMidleware,
  myCropsController.getYearsList
);
router.get("/notify/:id", myCropsController.notified);

module.exports = router;
