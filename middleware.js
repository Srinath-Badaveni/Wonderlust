const Listing = require("./models/listing")
const Review = require("./models/reviews")
const ExpressError = require("./utils/expressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const { model } = require("mongoose");

module.exports.isLoggedIn = (req, res,next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl
    req.flash("error", "Login to add Listing");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","Acces denied ! Not a valid Owner")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.validataListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => {
      el.message.join(",");
    });
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validataReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message.join(","));
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async(req,res,next)=>{
  let {id , reviewId} = req.params;
  let review = await Review.findById(reviewId)
  if(!review.author._id.equals(res.locals.currUser._id)){
      req.flash("error","Acces denied ! Not a valid Owner")
      return res.redirect(`/listings/${id}`)
  }
  next()
}