
const express = require('express');
const productController =require('../controllers/productController')
const router = express.Router();

router.post('/add',productController.addProduct );
router.get('/getproduct',productController.getProduct)
router.get('/:id',productController.deleteProduct)
router.put('/update',productController.updateProduct)
module.exports = router; 