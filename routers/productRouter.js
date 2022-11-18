const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();




router.get("/marketproduct", productController.marketProduct);
router.get("/image/:id", productController.getImage);


//midlewares for authentication
const authenticate = require("../midlewares/authorization");
//midlewares for checked user types
const farmerMidleware = require("../midlewares/farmerMidleware");


router.post(
  "/add",
  authenticate,
  farmerMidleware,
  productController.addProduct
);
router.get(
  "/getproduct/:id",
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
