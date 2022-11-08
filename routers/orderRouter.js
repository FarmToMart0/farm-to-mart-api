const express = require('express');
const orderController = require('../controllers/orderController')
const router = express.Router();
//router for the orders
router.get('/getplaceorders/:id',orderController.getAllOrders);
router.get('/getdeliveredorders/:id',orderController.getDeliveredOrders);
router.get('/getrejectedorders/:id',orderController.getRejectedOrders);
module.exports = router; 