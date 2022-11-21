const express = require("express");
const gsoController = require("../controllers/gsoController");
const router = express.Router();
const authenticate = require("../midlewares/authorization");
const mainOfficerMidleware = require("../midlewares/mainOfficerMidleware");

router.post('/register-gso',authenticate, mainOfficerMidleware, gsoController.gsoRegister); //register gso 
router.get('/get-gso/:nic',authenticate, mainOfficerMidleware, gsoController.getGsoDetails); //get gso details
router.put('/remove-gso',authenticate, mainOfficerMidleware, gsoController.removeGso); //delete gso
router.post('/check-availability-gso',authenticate, mainOfficerMidleware,gsoController.checkAvailabilityGSO); //check availability of gso
router.post('/user-details',authenticate, mainOfficerMidleware, gsoController.getUserDetailsGso); //get user details
router.put('/edit-gso',authenticate, mainOfficerMidleware, gsoController.editGSO); //edit gso details

module.exports = router;
