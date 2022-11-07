const express = require('express');
const orderController = require('../controllers/orderController')
const router = express.Router();
//router for the orders
router.get('/getplaceorders/:id',orderController.getPlaceOrders);

module.exports = router; 