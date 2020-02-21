const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      Campground = require("./models/campground"),
      Comment = require("./models/comment"),
      seedDB = require("./seeds"),
      passport = require("passport"),
      User = require("./models/user"),
      LocalStrategy = require("passport-local");
      // Campground = require("./models/campground"),
      // Campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
  secret: "Link is a sausage cat",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
      res.render("campgrounds/index", {campgrounds: allCampgrounds})
    }
  })
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req,res) {
  res.render("campgroounds/new")
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

//======================================
// COMMENTS ROUTES

app.get("/campgrounds/:id/comments/new", function(req,res) {
  // find campground by id
  Campground.findById(req.params.id, function(err,campground) {
    if(err) {
      console.log(err)
    } else {
      res.render("comments/new", {campground: campground})
    }
  })
});

app.post("/campgrounds/:id/comments", function(req,res) {
  //lookup campground by id
  Campground.findById(req.params.id, function(err,campground) {
    if(err) {
      console.log(err)
      res.redirect("/campgrounds")
    } else {
      //create new comment
      Comment.create(req.body.comment, function(err,comment) {
        if(err) {
          console.log(err)
        } else {
          //connect comment to campground
          campground.comments.push(comment)
          campground.save()
          //redirect to campground show page
          res.redirect("/campgrounds/" + campground._id)
        }
      })
    }
  })
});

//AUTH ROUTES

//show register form
app.get("/register", function(req,res) {
  res.render("register")
});

//handle sign up logic
app.post("/register", function(req,res) {
  var newUser = new User({username: req.body.username})
  User.register(newUser, req.body.password, function(err,user) {
    if(err) {
      console.log(err)
      return res.render("register")
    }
    passport.authenticate("local")(req,res,function() {
      res.redirect("/campgrounds")
    })
  })
});


app.listen(3000, () => {
  console.log("YELPCAMP Server is Up and Running")
});