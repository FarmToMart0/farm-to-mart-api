const express = require("express");
const productController = require("../controllers/productController");
//midlewares for authentication
const authenticate = require("../midlewares/authorization");
//midlewares for checked user types
const farmerMidleware = require("../midlewares/farmerMidleware");
const router = express.Router();

router.post(
  "/add",
  authenticate,
  farmerMidleware,
  productController.addProduct
);
router.get(
  "/getproduct",
  authenticate,
  farmerMidleware,
  productController.getProduct
);
router.get(
  "/:id",
  authenticate,
  farmerMidleware,
  productController.deleteProduct
);
router.put(
  "/update",
  authenticate,
  farmerMidleware,
  productController.updateProduct
);
router.get(
  "/ongoingbiddingcount/:id",
  authenticate,
  farmerMidleware,
  productController.getTotalOnGoingBids
);
module.exports = router;
