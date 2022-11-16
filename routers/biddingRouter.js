const express = require('express');
const biddingController =require('../controllers/biddingController')
const router = express.Router();

router.post('/setbid',biddingController.setBidding );
router.post('/getbid',biddingController.getBidding );
router.post('/notification',biddingController.pushNotification );
  
module.exports = router; 