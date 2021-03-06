var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Hike            = require("./models/hike"),
    Comment         = require("./models/comment"),
    User            = require("./models/user");
    
// Requiring Routes
var commentRoutes    = require("./routes/comments"),
    hikeRoutes       = require("./routes/hikes"),
    indexRoutes      = require("./routes/index");
    
mongoose.connect("mongodb://localhost/hike_utah");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Hike Utah USA",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/hikes", hikeRoutes);
app.use("/hikes/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The server has started...");
});