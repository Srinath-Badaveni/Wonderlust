require('dotenv').config();
const { model } = require("mongoose");
const Listing = require("../models/listing");
const mbxgeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_KEY;
const geocodingClient = mbxgeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings.ejs", { listings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("newlisting.ejs");
};

module.exports.showListng = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found ");
    res.redirect("/listings");
  }
  res.render("show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  // let cordinates = await geocodingClient
  //   .forwardGeocode({
  //     query: req.body.addListings.location,
  //     limit: 1,
  //   })
  //   .send();
  // let url = req.file.path;
  // let filename = req.file.filename;
  let sampleListing = new Listing(req.body.addListings);
  sampleListing.owner = req.user._id;
  // sampleListing.image = { url, filename };
  await sampleListing.save();
  req.flash("success", "Listing created successfully!!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found ");
    res.redirect("/listings");
  }
  // let originalImage = listing.image.url;
  // originalImage = originalImage.replace("/upload", "/upload/h_200,w_250");
  res.render("edit.ejs", { listing });
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findOneAndUpdate(
    { _id: id },
    { ...req.body.addListings }
  );

  // if (typeof req.file !== "undefined") {
  //   let url = req.file.path;
  //   let filename = req.file.filename;
  //   listing.image = { url, filename };
  //   await listing.save();
  // }
  req.flash("success", "Listing Edited successfully!!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted successfully!!");
  res.redirect("/listings");
};