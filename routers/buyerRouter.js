
const express = require('express');
const buyerController =require('../controllers/buyerController')
const router = express.Router();

router.post('/register',buyerController.buyerRegister );


module.exports = router; 