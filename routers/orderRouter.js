const express = require('express');
const orderController = require('../controllers/orderController')
const router = express.Router();
//router for the orders
router.get('/getplaceorders/:id',orderController.getPlaceOrders);
router.get('/markaspaid/:id',orderController.markAsPaid);
router.get('/markasdelivered/:id',orderController.markAsDelivered);
router.get('/markasrejected/:id',orderController.markAsRejected);
router.get('/undorejectedorder/:id',orderController.unDoRejectedOrder);
module.exports = router; 