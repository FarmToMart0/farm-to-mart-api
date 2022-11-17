const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/", authController.signin);

module.exports = router;
