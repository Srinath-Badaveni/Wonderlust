const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const {
  validataReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//reviwes part
router.post(
  "/",
  isLoggedIn,
  validataReview,
  wrapAsync(reviewController.createReview)
);

//delete review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;