const express = require('express');
const gsoController = require('../controllers/gsoController')
const router = express.Router();

router.post('/register-gso', gsoController.gsoRegister); //register gso 
router.get('/get-gso/:nic', gsoController.getGsoDetails); //get gso details
router.delete('/remove-gso/:id', gsoController.removeGso); //delete gso
router.post('/check-availability-gso',gsoController.checkAvailabilityGSO); //check availability of gso

module.exports = router; 