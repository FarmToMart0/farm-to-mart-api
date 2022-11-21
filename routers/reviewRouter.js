const express = require("express");
const reviewController = require("../controllers/reviewController");
const buyerMiddleware = require("../midlewares/buyerMiddleware");
const authenticate = require("../midlewares/authorization");
const router = express.Router();

router.get("/:id",authenticate, reviewController.getReviews);
router.post('/addreview',authenticate,buyerMiddleware, reviewController.addReviews)

module.exports = router;
