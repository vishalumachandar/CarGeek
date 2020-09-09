var passport=require("passport");
var express=require("express");
var router=express.Router();
var User=require("../models/user");

//To get
router.get("/",function(req,res){
	res.render("home");
});



//======================

//		AUTH ROUTES
//======================= 
router.get("/register",function(req,res){
	res.render("register");
});

router.post("/register",function(req,res){
	User.register(new User({username: req.body.username}), req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message)
			return res.render("register");
		}else{
			passport.authenticate("local")(req,res,function(){
				req.flash("success","Account created! Welcome to Car Geek! " + user.username);
				res.redirect("/cars");
			});
		}
	});
});

//=============================
//			LOGIN
//=============================
// LOGIN

router.get("/login",function(req,res){
	res.render("login");
})

router.post("/login",passport.authenticate("local",{
	successRedirect: "/cars",
	failureRedirect: "/login"
}),function(req,res){
});


// =====================
// 	LOGOUT
// =====================

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","logged you out");
	res.redirect("/cars");
})

// ============
// midddleware
// ============
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login")
}

module.exports=router;