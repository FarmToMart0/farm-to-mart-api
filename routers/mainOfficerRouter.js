const express = require("express");
const gsoController = require("../controllers/gsoController");
const router = express.Router();

router.post("/register-gso", gsoController.gsoRegister); //register gso
router.get("/get-gso/:nic", gsoController.getGsoDetails); //get gso details

module.exports = router;
