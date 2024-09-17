const Listing = require("../models/listing");
const Review = require("../models/reviews");

module.exports.createReview = async (req, res, next) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user;
  listing.review.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review created successfully!!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully!!");
  res.redirect(`/listings/${id}`);
};