const express = require('express');
const orderController = require('../controllers/orderController')
const router = express.Router();
//router for the orders
router.get('/getplaceorders/:id',orderController.getAllOrders);
router.get('/markaspaid/:id',orderController.markAsPaid);
router.get('/markasdelivered/:id',orderController.markAsDelivered);
router.get('/markasrejected/:id',orderController.markAsRejected);
router.get('/undorejectedorder/:id',orderController.unDoRejectedOrder);
router.get('/totalsales/:id',orderController.getTotalSales);
router.get('/totalsalesinlastmonth/:id',orderController.getTotalSalesInLastMonth);
router.get('/totalorderscount/:id',orderController.getTotalOrders);
router.get('/totalorderscountsincelastmonth/:id',orderController.getTotalOrdersCountInLastMonth);
router.get('/totalpendingordercount/:id',orderController.getTotalPendingOrdersCount);
router.get('/salseOverview/:id',orderController.getSalesOverview);
router.get('/ordersoverview/:id',orderController.getOrderOverview);
module.exports = router; 