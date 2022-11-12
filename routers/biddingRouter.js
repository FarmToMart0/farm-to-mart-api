const express = require('express');
const biddingController =require('../controllers/biddingController')
const router = express.Router();

router.post('/setbid',biddingController.setBidding );
router.post('/getbid',biddingController.getBidding );

  
module.exports = router; 