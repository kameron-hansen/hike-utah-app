var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");


// Home Page
router.get("/", function(req, res){
    res.render("landing");
});

// Authentication Routes
router.get("/register", function(req, res){
    res.render("register");
});

// Sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Hike Utah " + user.username);
            res.redirect("/hikes");
        });
    });
});

// Show login form
router.get("/login", function(req, res){
    res.render("login");
})

// Login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/hikes", 
        failureRedirect: "/login"
    }), function(req, res){
});

// Logout 
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have successfully logged out...");
    res.redirect("/hikes");
});

module.exports = router;