const express = require("express");
const reviewController = require("../controllers/reviewController");
const router = express.Router();

router.get("/:id", reviewController.getReviews);
router.post('/addreview',reviewController.addReviews)

module.exports = router;
