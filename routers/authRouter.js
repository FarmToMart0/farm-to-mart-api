const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();


router.post("/", authController.signin);
router.get("/verify/:token", authController.verify);
router.post("/forgotpassword", authController.resetPasswordSendMessage);
router.post("/reset-password", authController.passwordReset);
router.post("/check-expiried", authController.checkExpired);
module.exports = router;
