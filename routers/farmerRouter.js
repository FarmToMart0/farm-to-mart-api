
const express = require('express');
const farmerController =require('../controllers/farmerController')

const router = express.Router();

router.post('/register',farmerController.farmerRegister );

  
module.exports = router; 