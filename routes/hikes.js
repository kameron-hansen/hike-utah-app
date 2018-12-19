var express = require("express");
var router  = express.Router();
var Hike = require("../models/hike");
var middleware = require("../middleware");

// INDEX - Display a list of all hikes
router.get("/", function(req, res){
    Hike.find({}, function(err, allHikes){
        if(err){
            console.log(err);
        } else {
            res.render("hikes/index",  {hikes: allHikes});
        }
    });
});

// CREATE - Add new hike to database
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
      id: req.user._id,
      username: req.user.username
    };
    var newHike = {name: name, image: image, description: desc, author: author};
    Hike.create(newHike, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/hikes");
        }
    });
});

// NEW - Show form to create new hike 
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("hikes/new"); 
});

// SHOW - Show info about a hike
router.get("/:id", function(req, res){
    Hike.findById(req.params.id).populate("comments").exec(function(err, foundHike){
        if(err){
            console.log(err);
        } else {
            res.render("hikes/show", {hike: foundHike});     
        }
    });
});

// Edit Hike Route
router.get("/:id/edit", middleware.checkHikeOwnership, function(req, res){
        Hike.findById(req.params.id, function(err, foundHike){
            if(err){
                res.redirect("back");
            } else {
                res.render("hikes/edit", {hike: foundHike});
            }
        });
});

// Update Hike Route
router.put("/:id", middleware.checkHikeOwnership, function(req, res){
    Hike.findByIdAndUpdate(req.params.id, req.body.hike, function(err, updatedHike){
        if(err){
            res.redirect("/hikes");
        } else {
            res.redirect("/hikes/" + req.params.id);
        }
    });
});

// Destroy Hike Route
router.delete("/:id", middleware.checkHikeOwnership, function(req, res){
   Hike.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/hikes");
       } else {
           res.redirect("/hikes");
       }
   }); 
});

module.exports = router;