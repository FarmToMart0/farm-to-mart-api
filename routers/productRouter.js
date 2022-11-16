const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();

router.post("/add", productController.addProduct);
router.get("/getproduct", productController.getProduct);
router.put("/update", productController.updateProduct);
router.get("/marketproduct", productController.marketProduct);
router.get("/image/:id", productController.getImage);
router.get("/:id", productController.deleteProduct);
module.exports = router;
