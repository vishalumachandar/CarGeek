var express=require("express"),
 router=express.Router(),
 app=express(),
 bodyParser=require("body-parser"),
 mongoose=require	("mongoose"),
 flash=require("connect-flash"),
 passport=require("passport"),
 Car=require("./models/cars"),
 Comment=require("./models/comment"),
  LocalStrategy=require("passport-local"),
  methodOverride=require("method-override"),
 passportLocalMongoose=require("passport-local-mongoose"),
 User=require("./models/user"),
 seedDB=require("./seed");

var commentRoutes=require("./routes/comment"),
carRoutes=require("./routes/car"),
indexRoutes=require("./routes/index");
// to connect mongoose
 
mongoose.connect("mongodb://localhost/Car_Geek", { useNewUrlParser: true , useUnifiedTopology: true});

//PASSPORT CONGIF

app.use(require("express-session")({
	secret:"rust is the best and cutestt",
	resave: false,
	saveUninitialized: false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//To include bodyparser
app.use(bodyParser.urlencoded({extended: true}));
//TO connect views
app.set("view engine", "ejs");
//STYLESHEET
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//to include username in all
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
})
//SEED THE database
//seedDB();

// ro use routes
app.use(indexRoutes);
app.use(carRoutes);
app.use(commentRoutes);

//To listen in port 300
app.listen(3000,function(req,res){
	console.log("Server connected at port 3000");
});