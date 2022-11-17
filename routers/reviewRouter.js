const express = require("express");
const reviewController = require("../controllers/reviewController");
const router = express.Router();

router.get("/:id", reviewController.getReviews);

module.exports = router;
