const express = require("express");
const gsoController = require("../controllers/gsoController");
const router = express.Router();

router.post('/register-gso', gsoController.gsoRegister); //register gso 
router.get('/get-gso/:nic', gsoController.getGsoDetails); //get gso details
router.put('/remove-gso', gsoController.removeGso); //delete gso
router.post('/check-availability-gso',gsoController.checkAvailabilityGSO); //check availability of gso
router.post('/user-details', gsoController.getUserDetailsGso); //get user details
router.put('/edit-gso', gsoController.editGSO); //edit gso details

module.exports = router;
