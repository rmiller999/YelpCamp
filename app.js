const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      Campground = require("./models/campground"),
      seedDB = require("./seeds");
      // Campground = require("./models/campground"),
      // Campground = require("./models/campground");

seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


// Campground.create(
//   {
//     name: "Mt. Lodge", 
//     image: "https://picsum.photos/300?random=1",
//     description: "This is a great Mt. fuckin great spot eh?"
// }, function(err, campground){
//     if(err){
//       console.log(err)
//     } else {
//       console.log("NEW CAMPGROUND CREATED")
//       console.log(campground)
//     }
//   });

// var campgrounds = [
//   {name: "Salmon Creek", image: "https://picsum.photos/300?random=1"},
//   {name: "Mt. Lodge", image: "https://picsum.photos/300?random=2"},
//   {name: "BackGround Tents", image: "https://picsum.photos/300"}
// ]

app.get("/", function(req,res) {
  res.render("landing")
});

//INDEX - shows all campgrounds
app.get("/campgrounds", function(req,res) {
  // Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err)
    } else {
      res.render("index", {campgrounds: allCampgrounds})
    }
  })
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req,res) {
  res.render("new")
});

//CREATE - add new campground to DB
app.post("/campgrounds", function(req,res) {
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
app.get("/campgrounds/:id", function(req,res) {
  //find campground with provided ID
  Campground.findById(req.params.id, function(err, foundCampground) {
    if(err){
      console.log(err)
    } else {
      //render show page
      res.render("show", {campground: foundCampground})
    }
  })
});

app.listen(3000, () => {
  console.log("YELPCAMP Server is Up and Running")
});