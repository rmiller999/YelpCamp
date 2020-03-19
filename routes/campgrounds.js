var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//INDEX - shows all campgrounds
router.get("/", function(req,res) {
  // Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err)
    } else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user})
    }
  })
});

//NEW - show form to create new campground
router.get("//new", function(req,res) {
  res.render("campgrounds/new")
});

//CREATE - add new campground to DB
router.post("/", function(req,res) {
  // get data from form and at to campgrounds array
  var name = req.body.name
  var image = req.body.image
  var desc = req.body.description
  var newCampground = {name: name, image: image, description: desc}
  // Create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log(err)
    } else {
      //redirect back to campgrounds page
      res.redirect("/campgrounds")
    }
  })
});

//SHOW - shows info for one campground
router.get("/:id", function(req,res) {
  //find campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if(err){
      console.log(err)
    } else {
      console.log(foundCampground)
      //render show page
      res.render("campgrounds/show", {campground: foundCampground})
    }
  })
});

module.exports = router;