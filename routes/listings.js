const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validataListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    // upload.single("addListings[image]"),
    wrapAsync(listingController.createListing)
  );
//new listing router
router.get("/addNew", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListng))
  .put(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//edit router
router.get(
  "/edit/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;