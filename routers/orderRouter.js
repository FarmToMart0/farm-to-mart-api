const express = require("express");
const orderController = require("../controllers/orderController");
//midlewares for authentication
const authenticate = require("../midlewares/authorization");
//midlewares for checked user types
const farmerMidleware = require("../midlewares/farmerMidleware");
const router = express.Router();
//router for the orders

router.post("/placeorder",orderController.placeOrder);

router.get(
  "/getplaceorders/:id",
  authenticate,
  farmerMidleware,
  orderController.getAllOrders
);
router.get(
  "/markaspaid/:id",
  authenticate,
  farmerMidleware,
  orderController.markAsPaid
);
router.get(
  "/markasdelivered/:id",
  authenticate,
  farmerMidleware,
  orderController.markAsDelivered
);
router.get(
  "/markasrejected/:id",
  authenticate,
  farmerMidleware,
  orderController.markAsRejected
);
router.get(
  "/undorejectedorder/:id",
  authenticate,
  farmerMidleware,
  orderController.unDoRejectedOrder
);
router.get(
  "/totalsales/:id",
  authenticate,
  farmerMidleware,
  orderController.getTotalSales
);
router.get(
  "/totalsalesinlastmonth/:id",
  authenticate,
  farmerMidleware,
  orderController.getTotalSalesInLastMonth
);
router.get(
  "/totalorderscount/:id",
  authenticate,
  farmerMidleware,
  orderController.getTotalOrders
);
router.get(
  "/totalorderscountsincelastmonth/:id",
  authenticate,
  farmerMidleware,
  orderController.getTotalOrdersCountInLastMonth
);
router.get(
  "/totalpendingordercount/:id",
  authenticate,
  farmerMidleware,
  orderController.getTotalPendingOrdersCount
);
router.get(
  "/salseOverview/:id",
  authenticate,
  farmerMidleware,
  orderController.getSalesOverview
);
router.get(
  "/ordersoverview/:id",
  authenticate,
  farmerMidleware,
  orderController.getOrderOverview
);
module.exports = router;
